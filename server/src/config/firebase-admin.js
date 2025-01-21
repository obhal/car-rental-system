// src/config/firebase-admin.js
const admin = require('firebase-admin');

const serviceAccount = {
  "type": "service_account",
  "project_id": "asterdrive-86cbb",
  "private_key_id": "854dcffbf1821df004a56e737a0243eef5b3da52",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqCuGNeNbBK9vL\nhHZtFdwP8xcZTxTHjBZD08NrUnqaJshrT/rRW43rkZFDuKmcjAlL2JodDKJE1TEa\ne8BmNRFc3ONB9Am5bUebETgeSlRje9Oh0L8FtkX02WSW3nXro8MqWiAVx72Q9sMR\nv4GWYcg3WEOETuhe/HmlVtjVk8X/HLPv39BgoFrjd24lqIO0RW5Ab21FtWgG9C73\n6YqJ72onGwMmd4R7jP6nNFDUE+dzem8k8xgpY5XcvCUbN46iVhvkMRI6VKb6hvmq\nV/fB9oZIHi9lFAL6Wtkk0sn2kB0LzO6Oeq0j1jQxstBtlEPaWSoO5W/PYBDN2Isw\nO4t4YDgtAgMBAAECggEARIQD5ERHjCiG9NdX/JZtSIPzz7/cqJcatZPTTyA5xHlS\nEmN0tf0FD2FlPftfZHPMnyIU3xWjIMcidQBeQxCpAVkDvSR+8pdE3gevLA1ZOYjA\nepgpED0krQcXj+7tZthioGMWQJBuIsY7TaBzr8uQqDRJaDt/SB7FSUjYMB7ODf+y\nefSrQs/NjcaFRf1vTiHXbyHFTSdMnIY95AjUW1hb08Gz8PW9aZQx0OnH81OTb5tB\n25s3lyVXRLM3ogYMLvVX7oo8/iB4BlH9JORo9J8KSXXVpv6icGelOYhRRNzK9P9E\nvyRm0F8ILbVolOJ+mop4FaUtpLVfbn6yHgtOSeoWJQKBgQDqkvKdPeBeG8D3AJp0\nz3XrOoHE/NDzDHCn77kEJHPtuullD7x6uvO8aRq/bXQJ/eSFCLWwCIibrFiZDrWu\nv1o3mxs+qsjq38sbBczAR3jHgGaiiNOVTYTZ/6pRonPBPqL23WW7dtchGf8Iu57g\nWqh3xyvit9EyQuPGPkg+YupCuwKBgQC5kv2mJ7Z+OU0iojtY+Q+OpaHD8Y83ZEpx\nXMGqbcYaJj5b4Rqy5aoGt8myd6mA7KyxG8sPNTHkrT99iLSTApAtp2GLUISgmAE4\nC6/VfLiP4iv9Ex6DYWmlXRRvAq/Z1yCp1P+FFNCw9W1HkjVqWjYB+gqBmvI02nLv\nnNlOpHqGNwKBgQCpH6eirSEeWN5Id/vkqks3fOhhMXIpOlfjDNiVXv7icPejsLPQ\nvQfMWO87A1w9c/uV2xC7yXtM2fbK66scQcR3APKkvRe9F/tlEUpte1peZHobR5Fd\nPRXC4y1WTE0vD80JNdkKTwWOTSLule9XjKWYLla60JMYrNdycCdAK6sAzwKBgF2k\nxiiFW7rAUaNLeGVCcU5LWKEXEW0jR8mCxBurf08Mw2T758wkxrLTJY3QgpGTXOWW\nn9ZRwpahsis3w993aKgREdEKVZLwgZT1mMpDQKMiv43aiwhDLNuMZ9ZI5dIok8v/\ntt1CDrltb7KxHhFH6n7+3TRfqx9uqJcvcB0WNNnrAoGAEEGTFDdAJKEMY3SJHHKm\ndHyn9nXSZrS8qB9CkRsY7lS2BSbBhRJLvetrTHEhd9Tu5Kue31ljKS/SOk8wsq2t\n4iJ7U1BNNMSlWJGIHwxRmQ6T3ba3Js43rL+U96A9lDsr/OlibYZcHHEOxfmaXPwd\nUHiIc0P+43hKyXn/DjesY/4=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-euymw@asterdrive-86cbb.iam.gserviceaccount.com",
  "client_id": "116181285014397587494",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-euymw%40asterdrive-86cbb.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}



if (!admin.apps.length) {  // Prevent multiple initializations
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

module.exports = admin;