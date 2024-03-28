import { LiaTimesSolid } from 'react-icons/lia';
import { FaFileCsv } from 'react-icons/fa6';
import { styled } from 'styled-components';

import type { ReactIconType } from '../../../services/reactIconEntity';

const HtmlFileTag = styled.p`
  overflow: hidden;
  max-width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 10px 20px;
  border: 2px solid var(--color-grey-bright);
  border-radius: 8px;
  font-size: 26px;
  color: var(--color-grey-bright);

  & span {
    display: block;
    overflow: hidden;
    max-width: calc(100% - 30px - 46px);
    text-wrap: nowrap;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
    font-size: 16px;
  }
`;

const FileIcon = styled(FaFileCsv as ReactIconType)`
  flex-shrink: 0;
  margin-right: 10px !important;
  font-size: 20px !important;
  color: var(--color-grey-bright) !important;
  cursor: default !important;
`;

const DeleteIcon = styled(LiaTimesSolid as ReactIconType)`
  flex-shrink: 0;
  cursor: pointer;
  color: var(--color-grey-bright);
  margin-left: 20px;

  &:hover,
  &:focus {
    color: var(--color-white);
  }
`;

interface Props {
  name: string;
  handleDelete: () => void;
}

const FileTag = ({ name, handleDelete }: Props) => {
  return (
    <>
      <HtmlFileTag key={name}>
        <FileIcon />
        <span>{name}</span>
        <DeleteIcon onClick={handleDelete} />
      </HtmlFileTag>
    </>
  );
};

export default FileTag;
