type companyType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "workField": string,
    "address": string,
    "website": null,
    "description": string,
    "taxId": null
}

type studentType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "studentId": string,
    "isVerify": boolean,
    "isActive": boolean,
}

type jobType = {
    "id": string,
    "title": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "workField": string,
    "address": string,
    "website": null,
    "descriptions": {
        "responsibilities": string,
        "detailed": string
    }
    "taxId": null,
    "company": {
        "id": string,
        "name": string,
        "representative": string,
        "phone": string,
        "email": string,
        "address": string,
        "website": null,
        "avatar": string,
        "taxId": null
    }
}





type ErrorType = {
    response: {
        data: {
            message: string;
        }
    }
}