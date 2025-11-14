import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import { useUploadStore } from '../store/upload.store';
import { validateFiles } from '../utils/validation';
import { CONSTANTS } from '../utils/constants';
import type { FileWithPreview } from '../types';

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const StepList = styled.ol`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
  padding: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.8;
`;

const StepItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const UploadZone = styled.div<{ $isDragActive: boolean }>`
  background: ${({ theme, $isDragActive }) =>
    $isDragActive
      ? `linear-gradient(135deg, ${theme.colors.secondary}40, ${theme.colors.primary}40)`
      : `linear-gradient(135deg, ${theme.colors.secondary}, ${theme.colors.primary})`};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 3px dashed
    ${({ theme, $isDragActive }) => ($isDragActive ? theme.colors.white : 'transparent')};

  &:hover {
    opacity: 0.95;
    transform: translateY(-2px);
  }
`;

const UploadIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const UploadText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const UploadSubtext = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.white};
  opacity: 0.9;
  line-height: 1.5;
`;

const HiddenInput = styled.input`
  display: none;
`;

const InfoSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const InfoTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.md};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const InfoList = styled.ol`
  margin: 0 0 0 ${({ theme }) => theme.spacing.lg};
  padding: 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.8;
`;

const InfoItem = styled.li`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export function FileUpload() {
  const { files, setFiles, setError } = useUploadStore();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const allFiles = [...files, ...acceptedFiles];

      const error = validateFiles(allFiles);

      if (error) {
        setError(error);
        return;
      }

      const filesWithPreview: FileWithPreview[] = allFiles.map((file) => {
        const fileWithPreview = file as FileWithPreview;
        if (file.type.startsWith('image/')) {
          fileWithPreview.preview = URL.createObjectURL(file);
        }
        return fileWithPreview;
      });

      setFiles(filesWithPreview);
      setError(null);
    },
    [files, setFiles, setError],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    maxSize: CONSTANTS.MAX_FILE_SIZE,
    multiple: true,
  });

  return (
    <>
      <Section>
        <SectionTitle>Как работает</SectionTitle>
        <StepList>
          <StepItem>Выберите файлы;</StepItem>
          <StepItem>Получите номер загрузки;</StepItem>
          <StepItem>В студии согласуем формат и тираж.</StepItem>
        </StepList>

        <UploadZone $isDragActive={isDragActive} {...getRootProps()}>
          <UploadIcon>+</UploadIcon>
          <UploadText>Выбрать файлы</UploadText>
          <UploadSubtext>
            JPG, PNG, HEIC
            <br />
            до 200 МБ/файл, до 200 МБ суммарно
          </UploadSubtext>
        </UploadZone>

        <HiddenInput {...getInputProps()} />
      </Section>

      <InfoSection>
        <InfoTitle>Важно</InfoTitle>
        <InfoList>
          <InfoItem>Загрузка не оформляет заказ.</InfoItem>
          <InfoItem>Файлы храним 3 дня, затем удаляем.</InfoItem>
          <InfoItem>
            Загружая файлы, вы соглашаетесь с обработкой данных и условиями сервиса.
          </InfoItem>
        </InfoList>
      </InfoSection>
    </>
  );
}
