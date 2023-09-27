import { v4 as uuidv4 } from 'uuid';
import { Injectable } from '@nestjs/common';
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

@Injectable()
export class AzureBlobService {
  azureConnection = process.env.CONNECTION_STRING;
  containerName = process.env.CONTAINER_NAME;


  getBlobClient(imageName: string): BlockBlobClient {
    const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnection);
    const containerClient = blobClientService.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(imageName);
    return blobClient;
  }

  async upload(file: Express.Multer.File) {
    const uniqueFileName = uuidv4() + '_' + file.originalname;
    const blobClient = this.getBlobClient(uniqueFileName);
    await blobClient.uploadData(file.buffer);

    return blobClient.url;
  }
}
