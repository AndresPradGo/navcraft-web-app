import {
  ReactNode,
  useState,
  useEffect,
  DragEvent,
  ChangeEvent,
  FormEvent,
} from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FaFileExport, FaUpload } from "react-icons/fa6";
import { LiaTimesSolid } from "react-icons/lia";
import { LuFolderSearch } from "react-icons/lu";
import { MdOutlineLiveHelp } from "react-icons/md";
import { styled } from "styled-components";

import Button from "../button";
import FileTag from "./FileTag";
import useUploadFile from "./useUploadFile";
import Loader from "../../Loader";
import ExpandibleMessage from "../ExpandibleMessage";

const HtmlForm = styled.form`
  width: 100%;
  min-height: 200px;
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  padding: 0;
  overflow: hidden;

  & h1 {
    width: 100%;
    margin: 0;
    padding: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;

    & div {
      display: flex;
      align-items: center;
      text-wrap: wrap;
    }

    @media screen and (min-width: 510px) {
      padding: 10px;
      font-size: 27px;
    }
  }
`;

interface InputContainerProps {
  $loading: boolean;
}

const HtmlInputContainer = styled.div<InputContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.$loading ? "center" : "flex-start")};
  width: 100%;
  overflow-y: auto;
  padding: 20px 0;

  border-top: 1px solid var(--color-grey);
  border-bottom: 1px solid var(--color-grey);
  flex-grow: 1;

  @media screen and (min-width: 510px) {
    padding: 20px;
  }
`;

interface UploadSectionProps {
  $fileIsOver: boolean;
}

const HtmlUploadSection = styled.div<UploadSectionProps>`
  cursor: ${(props) => (props.$fileIsOver ? "copy" : "default")};
  transition: all 0.2s linear;
  background-color: ${(props) =>
    props.$fileIsOver
      ? "var(--color-primary-light)"
      : "var(--color-primary-bright)"};
  padding: 5px;
  margin: 20px 10px;
  width: calc(100% - 20px);
  & div {
    transform: scale(${(props) => (props.$fileIsOver ? "0.95" : "1")});
    transition: all 0.2s linear;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-height: 300px;
    border: 2px dashed
      ${(props) =>
        props.$fileIsOver ? "var(--color-grey-bright)" : "var(--color-grey)"};
    color: ${(props) =>
      props.$fileIsOver ? "var(--color-grey-bright)" : "var(--color-grey)"};

    & p {
      transition: margin 0.2s linear;
      margin: ${(props) => (props.$fileIsOver ? "10px 0" : "20px 0")};
    }

    & input {
      width: 0;
      height: 0;
    }

    & label {
      transition: all 0.2s linear;
      display: flex;
      align-items: center;
      padding: 5px 20px;
      background-color: var(--color-highlight);
      color: var(--color-primary-dark);
      border-radius: 5px;
      cursor: pointer;

      &:hover,
      &:focus {
        background-color: var(--color-highlight-hover);
      }
    }
  }
`;

const HtmlButtons = styled.div`
  max-height: 65px;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  padding: 10px 20px;
`;

const SaveIcon = styled(AiOutlineSave)`
  font-size: 25px;
`;

const UploadIcon = styled(FaUpload)`
  font-size: 40px;
`;

const BrowseIcon = styled(LuFolderSearch)`
  font-size: 20px;
  margin: 0 5px;
`;

const HelpIcon = styled(MdOutlineLiveHelp)`
  font-size: 20px;
  flex-shrink: 0;
  margin: 0 0 0 5px;
`;

const ExportIcon = styled(FaFileExport)`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 2px;

  @media screen and (min-width: 510px) {
    font-size: 30px;
  }
`;

interface CloseIconProps {
  $disabled: boolean;
}

const CloseIcon = styled(LiaTimesSolid)<CloseIconProps>`
  flex-shrink: 0;
  font-size: 25px;
  margin: 0 5px;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  color: var(--color-grey);
  opacity: ${(props) => (props.$disabled ? "0.3" : "1")};

  &:hover,
  &:focus {
    color: ${(props) =>
      props.$disabled ? "var(--color-grey)" : "var(--color-white)"};
  }

  @media screen and (min-width: 510px) {
    margin: 0 10px;
    font-size: 30px;
  }
`;

interface SubmissionsDataType {
  path: string;
  successMessage: string;
  queryKeys: (string | number)[][];
}

interface Props {
  closeModal: () => void;
  submissionData: SubmissionsDataType;
  title: string;
  icon: ReactNode;
  instructions: string[];
  modalIsOpen: boolean;
}

const FileForm = ({
  title,
  icon,
  instructions,
  closeModal,
  modalIsOpen,
  submissionData: { path, successMessage, queryKeys },
}: Props) => {
  const [submited, setSubmited] = useState(false);
  const [fileIsOver, setFileIsOver] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const mutation = useUploadFile(path, successMessage, queryKeys);

  useEffect(() => {
    if (!modalIsOpen) {
      setFile(null);
    }
  }, [modalIsOpen]);

  useEffect(() => {
    if (submited && !mutation.isLoading) {
      closeModal();
    }
  }, [submited, mutation.isLoading]);

  const handleDragover = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemDraged = e.dataTransfer.items[0];
    if (!file && itemDraged.kind === "file" && itemDraged.type === "text/csv")
      setFileIsOver(true);
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileIsOver(false);
  };

  const handleFileAdd = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const newFile = e.target.files ? e.target.files[0] : null;
    if (!file && newFile && newFile.type === "text/csv") setFile(newFile);
  };

  const handleFileDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFile = e.dataTransfer.items[0].getAsFile();
    if (!file && newFile && newFile.type === "text/csv") {
      setFileIsOver(false);
      setFile(newFile);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file && !mutation.isLoading) {
      const formData = new FormData();
      formData.append("csv_file", file);
      mutation.mutate(formData);
      setSubmited(true);
    }
  };

  return (
    <HtmlForm onSubmit={handleSubmit}>
      <h1>
        <div>
          <ExportIcon />
          {icon}
          {title}
        </div>
        {mutation.isLoading ? (
          <CloseIcon onClick={() => {}} $disabled={true} />
        ) : (
          <CloseIcon onClick={closeModal} $disabled={false} />
        )}
      </h1>
      <HtmlInputContainer $loading={mutation.isLoading}>
        {mutation.isLoading ? (
          <Loader />
        ) : (
          <>
            <ExpandibleMessage reset={!modalIsOpen} messageList={instructions}>
              Help <HelpIcon />
            </ExpandibleMessage>
            <HtmlUploadSection
              $fileIsOver={fileIsOver}
              onDragOver={handleDragover}
              onDragLeave={handleDragEnd}
              onDrop={handleFileDrop}
            >
              <div>
                {file ? (
                  <FileTag
                    name={file.name}
                    handleDelete={() => setFile(null)}
                  />
                ) : (
                  <>
                    <UploadIcon />
                    <p>Drag & Drop CSV File or</p>
                    <input
                      type="file"
                      id="csv_upload"
                      accept=".csv"
                      onChange={handleFileAdd}
                    />
                    <label htmlFor="csv_upload">
                      Browse <BrowseIcon />
                    </label>
                  </>
                )}
              </div>
            </HtmlUploadSection>
          </>
        )}
      </HtmlInputContainer>
      <HtmlButtons>
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          backgroundColor="var(--color-grey)"
          backgroundHoverColor="var(--color-grey-bright)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          handleClick={closeModal}
          btnType="button"
          width="120px"
          height="35px"
          disabled={mutation.isLoading}
        >
          Cancel
        </Button>
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-primary-dark)"
          backgroundColor="var(--color-contrast)"
          backgroundHoverColor="var(--color-contrast-hover)"
          fontSize={15}
          margin="5px 0"
          borderRadious={4}
          btnType="submit"
          width="120px"
          height="35px"
          spaceChildren="space-evenly"
          disabled={mutation.isLoading}
          disabledText="Saving..."
        >
          Save
          <SaveIcon />
        </Button>
      </HtmlButtons>
    </HtmlForm>
  );
};

export default FileForm;
