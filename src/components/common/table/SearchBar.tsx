import { styled } from "styled-components";
import { LiaTimesSolid } from "react-icons/lia";
import { useState, FormEvent } from "react";

const HtmlContainer = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
  width: 100%;
`;

interface FormProps {
  $isFocus: boolean;
}
const HtmlForm = styled.form<FormProps>`
  transition: all 0.2s linear;
  background: var(--color-grey-dark);
  border: 1px solid
    ${(props) => (props.$isFocus ? "var(--color-white)" : "var(--color-grey)")};
  border-radius: 200px;
  width: 100%;
  display: flex;
  align-items: center;

  &: focus {
    border: 1px solid color(--color-highlight);
  }

  & input {
    min-width: 0px;
    background-color: transparent;
    color: var(--color-white);
    flex-basis: 10px;
    flex-grow: 1;
    flex-shrink: 1;
    border: 0;
    outline: none;
    font-size: 15px;
    padding: 15px 19px;

    @media screen and (min-width: 768px) {
      padding: 20px 24px;
      font-size: 20px;
    }
  }

  & button {
    border: none;
    display: flex;
    justify-content: center;
    align-items: center;

    cursor: pointer;
    font-size: 20px;
    flex-basis: 27px;
    flex-grow: 0;
    flex-shrink: 0;
    height: 27px;
    padding: 3px;
    border-radius: 100%;
    background-color: var(--color-grey);
    color: var(--color-primary-dark);
    margin-right: 10px;

    &:hover,
    &:focus {
      background-color: var(--color-grey-bright);
      color: var(--color-primary-dark);
    }

    @media screen and (min-width: 768px) {
      font-size: 30px;
      flex-basis: 40px;
      height: 40px;
      padding: 5px;
    }
  }
`;

export interface SearchBarDataType {
  placeHolder?: string;
}

interface Props extends SearchBarDataType {
  text: string;
  setText: (text: string) => void;
}

const SearchBar = ({ placeHolder, text, setText }: Props) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleClearSearch = (event: FormEvent) => {
    event.preventDefault();
    setText("");
  };

  return (
    <HtmlContainer>
      <HtmlForm $isFocus={isFocus} onSubmit={handleClearSearch}>
        <input
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(event) => setText(event.target.value)}
          id="search"
          type="text"
          autoComplete="off"
          placeholder={placeHolder ? placeHolder : "Search..."}
          value={text}
        />
        <button type="submit">
          <LiaTimesSolid />
        </button>
      </HtmlForm>
    </HtmlContainer>
  );
};

export default SearchBar;
