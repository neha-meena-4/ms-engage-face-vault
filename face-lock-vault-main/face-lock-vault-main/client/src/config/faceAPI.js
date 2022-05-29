const msRest = require('@azure/ms-rest-js')
const Face = require('@azure/cognitiveservices-face')
const { v4: uuid } = require('uuid')

const key = 's5d4f56saewq8ertxcvew3521asq23543wqs2'
const endpoint = 'https://face-vault-api/verify'

const credentials = new msRest.ApiKeyCredentials({
    inHeader: { 'Ocp-Apim-Subscription-Key': key },
})
const client = new Face.FaceClient(credentials, endpoint)

const image_base_url = 'https://csdx.blob.core.windows.net/resources/Face/Images/'
const person_group_id = uuid()

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

async function DetectFaceRecognize(url) {
    let detected_faces = await client.face.detectWithUrl(url, {
        detectionModel: 'detection_03',
        recognitionModel: 'recognition_04',
        returnFaceAttributes: ['QualityForRecognition'],
    })
    return detected_faces.filter(
        (face) =>
            face.faceAttributes.qualityForRecognition == 'high' ||
            face.faceAttributes.qualityForRecognition == 'medium'
    )
}

async function AddFacesToPersonGroup(person_dictionary, person_group_id) {
    console.log('Adding faces to person group...')

    await Promise.all(
        Object.keys(person_dictionary).map(async function (key) {
            const value = person_dictionary[key]

            await sleep(2000)

            let person = await client.personGroupPerson.create(person_group_id, {
                name: key,
            })
            console.log('Create a persongroup person: ' + key + '.')

            await Promise.all(
                value.map(async function (similar_image) {
                    let sufficientQuality = true
                    let detected_faces = await client.face.detectWithUrl(
                        image_base_url + similar_image,
                        {
                            returnFaceAttributes: ['QualityForRecognition'],
                            detectionModel: 'detection_03',
                            recognitionModel: 'recognition_03',
                        }
                    )
                    detected_faces.forEach((detected_face) => {
                        if (
                            detected_face.faceAttributes.qualityForRecognition != 'high'
                        ) {
                            sufficientQuality = false
                        }
                    })

                    if (sufficientQuality) {
                        console.log(
                            'Add face to the person group person: (' +
                                key +
                                ') from image: ' +
                                similar_image +
                                '.'
                        )
                        await client.personGroupPerson.addFaceFromUrl(
                            person_group_id,
                            person.personId,
                            image_base_url + similar_image
                        )
                    }
                })
            )
        })
    )

    console.log('Done adding faces to person group.')
}

async function WaitForPersonGroupTraining(person_group_id) {
    console.log('Waiting 10 seconds...')
    await sleep(10000)
    let result = await client.personGroup.getTrainingStatus(person_group_id)
    console.log('Training status: ' + result.status + '.')
    if (result.status !== 'succeeded') {
        await WaitForPersonGroupTraining(person_group_id)
    }
}

async function IdentifyInPersonGroup() {
    const person_dictionary = {
        'Family1-Dad': ['Family1-Dad1.jpg', 'Family1-Dad2.jpg'],
        'Family1-Mom': ['Family1-Mom1.jpg', 'Family1-Mom2.jpg'],
        'Family1-Son': ['Family1-Son1.jpg', 'Family1-Son2.jpg'],
        'Family1-Daughter': ['Family1-Daughter1.jpg', 'Family1-Daughter2.jpg'],
        'Family2-Lady': ['Family2-Lady1.jpg', 'Family2-Lady2.jpg'],
        'Family2-Man': ['Family2-Man1.jpg', 'Family2-Man2.jpg'],
    }

    let source_image_file_name = 'identification1.jpg'

    console.log('Creating a person group with ID: ' + person_group_id)
    await client.personGroup.create(person_group_id, person_group_id, {
        recognitionModel: 'recognition_04',
    })

    await AddFacesToPersonGroup(person_dictionary, person_group_id)

    console.log()
    console.log('Training person group: ' + person_group_id + '.')
    await client.personGroup.train(person_group_id)

    await WaitForPersonGroupTraining(person_group_id)
    console.log()

    let face_ids = (
        await DetectFaceRecognize(image_base_url + source_image_file_name)
    ).map((face) => face.faceId)
    let results = await client.face.identify(face_ids, { personGroupId: person_group_id })
    await Promise.all(
        results.map(async function (result) {
            let person = await client.personGroupPerson.get(
                person_group_id,
                result.candidates[0].personId
            )
            console.log(
                'Person: ' +
                    person.name +
                    ' is identified for face in: ' +
                    source_image_file_name +
                    ' with ID: ' +
                    result.faceId +
                    '. Confidence: ' +
                    result.candidates[0].confidence +
                    '.'
            )
        })
    )
    console.log()
}

export default IdentifyInPersonGroup
