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
    const uniqueId = Date.now() + '_' + Math.floor(Math.random() * 1000);
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFileName = uniqueId + '.' + fileExtension;
    const blobClient = this.getBlobClient(uniqueFileName);
    await blobClient.uploadData(file.buffer);

    return blobClient.url;
  }

  async delete(filename: string) {
    const blobClient = this.getBlobClient(filename);
    await blobClient.deleteIfExists();
  }
}
