import { GrAnnounce } from 'react-icons/gr';
import { IoWarningOutline } from 'react-icons/io5';
import { PiWarningCircleBold } from 'react-icons/pi';
import { styled } from 'styled-components';

interface HtmlTagProps {
  $type: 'normal' | 'warning' | 'danger';
  $margin: string;
  $maxWidth: string;
}

const HtmlContainer = styled.div<HtmlTagProps>`
  padding: 15px;
  margin: ${(props) => props.$margin};
  max-width: ${(props) => props.$maxWidth};

  display: flex;
  align-items: center;
  border-radius: 5px;
  text-wrap: wrap;
  background-color: ${(props) =>
    props.$type === 'warning'
      ? 'var(--color-caution-message)'
      : props.$type === 'normal'
        ? 'var(--color-highlight-hover)'
        : 'var(--color-danger-message)'};

  color: ${(props) =>
    props.$type === 'danger'
      ? 'var(--color-white)'
      : 'var(--color-primary-dark)'};

  & svg {
    margin-right: 20px;
    flex-shrink: 0;
    font-size: 40px;
  }

  & div {
    display: flex;
    flex-direction: column;

    & h1 {
      margin: 0;
      text-transform: uppercase;
      font-weight: bold;
      font-size: 16px;
      color: ${(props) =>
        props.$type === 'danger'
          ? 'var(--color-white)'
          : 'var(--color-primary-dark)'};
    }

    & p {
      margin: 0;
    }
  }
`;

interface Props {
  isDanger?: boolean;
  isWarning?: boolean;
  title: string;
  message: string;
  margin?: string;
  maxWidth?: number;
}
const AnnouncementBox = ({
  isDanger,
  isWarning,
  message,
  title,
  margin,
  maxWidth,
}: Props) => {
  return (
    <HtmlContainer
      $type={isDanger ? 'danger' : isWarning ? 'warning' : 'normal'}
      $margin={margin ? margin : '0'}
      $maxWidth={maxWidth ? `${maxWidth}px` : '100%'}
    >
      {isDanger ? (
        <IoWarningOutline />
      ) : isWarning ? (
        <PiWarningCircleBold />
      ) : (
        <GrAnnounce />
      )}
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </HtmlContainer>
  );
};

export default AnnouncementBox;
