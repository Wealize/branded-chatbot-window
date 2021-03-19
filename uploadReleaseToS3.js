require('dotenv').config()

const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
const path = require('path')

const { version } = require('./package.json')
const { env: { AWS_S3_BUCKET } } = process

const bundleVersion = version.replace(/\./g, '')
const folderPath = path.join(__dirname, `/dist/${bundleVersion}/`)
const s3 = new S3({ signatureVersion: 'v4' })

fs.readdir(folderPath, (err, files) => {
  if (err) throw err

  console.log(`Uploading resources to s3://${AWS_S3_BUCKET}/${bundleVersion}/`)

  for (const fileName of files) {
    const filePath = path.join(folderPath, fileName)

    if (fs.lstatSync(filePath).isDirectory())
      continue

    fs.readFile(filePath, (err, fileContent) => {
      if (err) throw err

      s3.putObject({
        Bucket: AWS_S3_BUCKET,
        Key: `${bundleVersion}/${fileName}`,
        Body: fileContent,
        ContentType: 'application/javascript'
      }).promise().then(() => {
        console.log(`Successfully uploaded ${fileName}`)
      }).catch(console.log)
    })
  }
})
