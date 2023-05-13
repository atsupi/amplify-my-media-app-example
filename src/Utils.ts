import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Auth } from 'aws-amplify';
import config from './aws-exports';   

const s3Region = config.aws_user_files_s3_bucket_region;

export async function invokeVideoConvert(key: string, newKey: string) {
    const command = {
        "key": key,
        "newKey": newKey,
    }
    const postPromise = fetch("http://localhost:3001/media", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(command),
    });
    postPromise.then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        return data;
    }).catch((err) => console.log(err));
}

let s3Client: S3Client = new S3Client({region: s3Region});

Auth.currentCredentials().then((cred)=> {
    s3Client = new S3Client({
        region: s3Region,
        credentials: Auth.essentialCredentials(cred),
    });
});

export async function getPresignedUrl(bucket: string, key: string) {
    const params = {
        Bucket: bucket,
        Key: key,
    }
    const command = new GetObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, {expiresIn: 3600});
    return url;
}
