import styled from 'styled-components';
import { useUploadStore } from '../store/upload.store';
import { formatFileSize } from '../utils/format';

const PreviewContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const PreviewItem = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.border};

  &:hover button {
    opacity: 1;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PreviewPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-transform: uppercase;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
  border: none;
  padding: 0;

  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
  }
`;

const SummaryText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

export function FilePreview() {
  const { files, removeFile } = useUploadStore();

  if (files.length === 0) {
    return null;
  }

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return (
    <PreviewContainer>
      <PreviewGrid>
        {files.map((file, index) => (
          <PreviewItem key={`${file.name}-${index}`}>
            {file.preview ? (
              <PreviewImage src={file.preview} alt={file.name} />
            ) : (
              <PreviewPlaceholder>{file.name.split('.').pop()?.toUpperCase()}</PreviewPlaceholder>
            )}
            <RemoveButton onClick={() => removeFile(index)}>×</RemoveButton>
          </PreviewItem>
        ))}
      </PreviewGrid>

      <SummaryText>
        {files.length} {files.length === 1 ? 'файл' : 'файлов'} • {formatFileSize(totalSize)}
      </SummaryText>
    </PreviewContainer>
  );
}
