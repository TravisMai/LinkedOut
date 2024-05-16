import {
  BlobServiceClient,
  BlockBlobClient,
  ContainerClient,
} from '@azure/storage-blob';
import { AzureBlobService } from 'src/common/service/azureBlob.service';

describe('AzureBlobService', () => {
  let azureBlobService: AzureBlobService;
  let blobServiceClient: jest.Mocked<BlobServiceClient>;
  let containerClient: jest.Mocked<ContainerClient>;
  let blockBlobClient: jest.Mocked<BlockBlobClient>;

  beforeEach(() => {
    process.env.CONNECTION_STRING = 'test_connection_string';
    process.env.CONTAINER_NAME = 'test_container_name';

    blobServiceClient = {
      getContainerClient: jest.fn(),
    } as unknown as jest.Mocked<BlobServiceClient>;

    containerClient = {
      getBlockBlobClient: jest.fn(),
    } as unknown as jest.Mocked<ContainerClient>;

    blockBlobClient = {
      uploadData: jest.fn(),
      url: 'https://test.blob.core.windows.net/test_container_name/test.jpg',
      deleteIfExists: jest.fn(),
    } as unknown as jest.Mocked<BlockBlobClient>;

    azureBlobService = new AzureBlobService();
  });

  it('should return a block blob client', () => {
    jest
      .spyOn(BlobServiceClient, 'fromConnectionString')
      .mockReturnValue(blobServiceClient);
    blobServiceClient.getContainerClient.mockReturnValue(containerClient);
    containerClient.getBlockBlobClient.mockReturnValue(blockBlobClient);

    const result = azureBlobService.getBlobClient('test.jpg');

    expect(result).toBe(blockBlobClient);
    expect(BlobServiceClient.fromConnectionString).toHaveBeenCalledWith(
      'test_connection_string',
    );
    expect(blobServiceClient.getContainerClient).toHaveBeenCalledWith(
      'test_container_name',
    );
    expect(containerClient.getBlockBlobClient).toHaveBeenCalledWith('test.jpg');
  });

  it('should upload a file', async () => {
    jest
      .spyOn(BlobServiceClient, 'fromConnectionString')
      .mockReturnValue(blobServiceClient);
    blobServiceClient.getContainerClient.mockReturnValue(containerClient);
    containerClient.getBlockBlobClient.mockReturnValue(blockBlobClient);
    blockBlobClient.uploadData.mockResolvedValue(undefined);

    const file = {
      buffer: Buffer.from('test'),
      originalname: 'test.jpg',
    } as Express.Multer.File;

    const result = await azureBlobService.upload(file);

    expect(result).toBe(blockBlobClient.url);
    expect(blockBlobClient.uploadData).toHaveBeenCalledWith(file.buffer);
  });

  it('should delete a file', async () => {
    jest
      .spyOn(BlobServiceClient, 'fromConnectionString')
      .mockReturnValue(blobServiceClient);
    blobServiceClient.getContainerClient.mockReturnValue(containerClient);
    containerClient.getBlockBlobClient.mockReturnValue(blockBlobClient);
    blockBlobClient.deleteIfExists.mockResolvedValue({
      succeeded: true,
      _response: {} as any,
    });

    await azureBlobService.delete('test.jpg');

    expect(blockBlobClient.deleteIfExists).toHaveBeenCalled();
  });
});
