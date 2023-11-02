import { ReactNode } from "react";
import { styled } from "styled-components";

interface ContainerProps {
  $isOpen: boolean;
}

const HtmlBody = styled.div<ContainerProps>`
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.3s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: ${(props) => (props.$isOpen ? 999 : -1)};
  background-color: var(--color-modal-background);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
  backdrop-filter: blur(2px) saturate(180%);
`;

interface ModalProps {
  $isOpen: boolean;
  $fullHeight: boolean;
}

const HtmlModal = styled.div<ModalProps>`
  transition: all 0.3s ease-out;
  transform: ${(props) => (props.$isOpen ? "none" : "translate(0, -50px)")};
  overflow-x: hidden;
  overflow-y: hidden;
  border: 1px solid var(--color-grey);
  border-radius: 8px;
  min-height: ${(props) => (props.$fullHeight ? "97vh" : "200px")};
  max-height: 97vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  pointer-events: ${(props) => (props.$isOpen ? "auto" : "none")};
  background-color: var(--color-primary);
  margin: 10px;
  flex-basis: 600px;
  flex-shrink: 1;
`;

interface Props {
  children: ReactNode;
  isOpen: boolean;
  fullHeight?: boolean;
}

const Modal = ({ children, isOpen, fullHeight }: Props) => {
  return (
    <HtmlBody $isOpen={isOpen}>
      <HtmlModal $isOpen={isOpen} $fullHeight={!!fullHeight}>
        {children}
      </HtmlModal>
    </HtmlBody>
  );
};

export default Modal;
