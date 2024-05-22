type companyType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "workField": string,
    "address": string,
    "website": string,
    "description": string,
    "taxId": string,
    "isVerify": boolean,
    "isActive": boolean
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
    "title": string,
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

type facultyType = Record<string, never>;

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
    "openDate": Date,
    "expireDate": Date,
    "isActive": boolean
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
    "resume": resumeType,
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

type internshipType = {
    "id": string,
    "document": string[],
    "result": number,
    "created": Date,
    "updated": Date,
    "jobApplicants": jobApplicationType,
    "staff": staffType,
}

type staffType = {
    "id": string,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "avatar": string,
    "role": string,
    "created": Date,
    "updated": Date,
    "isAdmin": boolean,
    "staffId": number,
    "faculty": facultyType,
}
