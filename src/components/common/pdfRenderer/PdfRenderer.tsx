import { ReactNode } from 'react';
import { FaDownload, FaRegFilePdf } from 'react-icons/fa6';
import { styled } from 'styled-components';
import { PDFViewer, usePDF } from '@react-pdf/renderer';

import PdfDocument from './PdfDocument';
import type { Props as PdfContent } from './PdfDocument';
import Button from '../button/index';
import FlightWarningList from '../../FlightWarningList';

const HtmlPDFViwerContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  min-height: 800px;
  height: calc(100vh - 70px);

  @media screen and (min-width: 768px) {
    height: calc(100vh - 80px);
  }
`;

const DownloadIcon = styled(FaDownload)`
  font-size: 20px;
  margin-right: 8px;
  padding-bottom: 3px;
`;

const PDFIcon = styled(FaRegFilePdf)`
  font-size: 25px;
  margin-right: 8px;
`;

interface Props extends PdfContent {
  btnText?: ReactNode;
  handleBtnClick?: () => void;
}

const PdfRenderer = ({ content, btnText, handleBtnClick }: Props) => {
  const document = <PdfDocument content={content} />;
  const [instance, _] = usePDF({ document });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <>
      <Button
        color="var(--color-primary-dark)"
        hoverColor="var(--color-grey-dark)"
        backgroundColor="var(--color-contrast)"
        backgroundHoverColor="var(--color-contrast-hover)"
        width="250px"
        height="45px"
        fontSize={18}
        shadow={false}
        spaceChildren="space-evenly"
        borderRadious={5}
        margin="20px 10px 0"
        onlyHover={true}
        handleClick={handleBtnClick}
      >
        {btnText}
      </Button>
      {instance.url ? (
        <Button
          color="var(--color-primary-dark)"
          hoverColor="var(--color-grey-dark)"
          backgroundColor="var(--color-grey)"
          backgroundHoverColor="var(--color-grey-bright)"
          width="250px"
          height="45px"
          fontSize={18}
          shadow={false}
          spaceChildren="space-evenly"
          borderRadious={5}
          margin="15px 10px 20px"
          href={instance.url}
          isAnchor={true}
          onlyHover={true}
        >
          {isMobile ? (
            <>
              Open PDF <PDFIcon />
            </>
          ) : (
            <>
              Download PDF <DownloadIcon />
            </>
          )}
        </Button>
      ) : null}
      {isMobile ? (
        <FlightWarningList
          warnings={[
            [
              'PDF Viwer is only supported in desktop web-browsers. To view the briefing in a mobile browser, open the PDF in a new tab.',
            ],
          ]}
        />
      ) : (
        <HtmlPDFViwerContainer>
          <PDFViewer width="100%" height="100%">
            {document}
          </PDFViewer>
        </HtmlPDFViwerContainer>
      )}
    </>
  );
};

export default PdfRenderer;
