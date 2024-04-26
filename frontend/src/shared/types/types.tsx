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
    "role": string,
    "created": string,
    "updated": string,
    "isVerify": boolean,
    "studentId": number,
    "gpa": number,
    "year": number,
    "major": string,
    "classCode": string,
    "resume": resumeType[],
    "isActive": boolean,
    "process": string,
    "socialMedia": {
        github: string;
        linkedin: string;
        google: string;
        facebook: string;
        twitter: string;
    },
    "objective": string,
    "education": educationType[],
    "workingHistory": workingHistoryType[],
    "certificate": certificateType[],
    "skill": skillType[],
    "additionalInformation": additionalInformationType[],
    "reference": referenceType[],
    "faculty": facultyType,
}

type resumeType = {
    "id": string,
    "url": string,
}

type educationType = {
    "id": string,
    "school": string,
    "major": string,
    "startTime": string,
    "endTime": string,
    "gpa": string
}

type workingHistoryType = {
    "company": string,
    "position": string,
    "time": string,
    "task": string
}

type certificateType = {
    "name" : string,
    "issuedBy" : string,
    "time" : string
}

type skillType = {
    "name": string,
    "level": string
}

type additionalInformationType = {
    "name": string,
    "level": string
}

type referenceType = {
    "name": string,
    "email": string,
    "phone": string
}

type facultyType = {
}

type jobType = {
    "id": string,
    "company": companyType,
    "title": string,
    "image": string[],
    "salary": number,
    "level": string,
    "internshipPrograme": string,
    "workType": string,
    "quantity": number,
    "descriptions": postDescriptionType,
    "created": Date,
    "updated": Date,
    "expireDate": Date
}

type postDescriptionType = {
    "aboutUs": string,
    "responsibilities": string[],
    "requirements": string[],
    "preferredQualifications": string[],
    "benefits": string[]
}



type jobApplicationType = {
    "id": string,
    "student": studentType,
    "job": jobType,
    "status": string,
    "created": Date,
    "updated": Date
}


type ErrorType = {
    response: {
        data: {
            message: string;
        }
    }
}