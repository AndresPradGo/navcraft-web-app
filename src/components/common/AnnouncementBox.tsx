import { GrAnnounce } from "react-icons/gr";
import { PiWarningCircleBold } from "react-icons/pi";
import { styled } from "styled-components";

interface HtmlTagProps {
  $isWarning: boolean;
}

const HtmlContainer = styled.div<HtmlTagProps>`
  padding: 15px;
  align-self: center;
  max-width: 100%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  text-wrap: wrap;
  background-color: ${(props) =>
    props.$isWarning
      ? "var(--color-contrast-hover)"
      : "var(--color-highlight-hover)"};

  color: var(--color-primary-dark);

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
      color: var(--color-primary-dark);
    }

    & p {
      margin: 0;
    }
  }
`;

interface Props {
  isWarning?: boolean;
  title: string;
  message: string;
}
const AnnouncementBox = ({ isWarning, message, title }: Props) => {
  return (
    <HtmlContainer $isWarning={!!isWarning}>
      {isWarning ? <PiWarningCircleBold /> : <GrAnnounce />}
      <div>
        <h1>{title}</h1>
        <p>{message}</p>
      </div>
    </HtmlContainer>
  );
};

export default AnnouncementBox;
