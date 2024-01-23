import { FaDownload, FaRegFilePdf } from "react-icons/fa6";
import { styled } from "styled-components";
import { PDFViewer, usePDF } from "@react-pdf/renderer";

import PdfDocument from "./PdfDocument";
import Button from "../button/index";
import FlightWarningList from "../../FlightWarningList";

const HtmlPDFViwerContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 2400px;
  max-height: 100vh;
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

const PdfRenderer = () => {
  const document = <PdfDocument />;
  const [instance, update] = usePDF({ document });

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <>
      {isMobile ? (
        <>
          <FlightWarningList
            warnings={[
              [
                "PDF Viwer is only supported in desktop web-browsers. To view the briefing in a mobile browser, open the PDF in a new tab:",
              ],
            ]}
          />
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
              margin="20px 10px 50px"
              href={instance.url}
              isAnchor={true}
            >
              Open PDF
              <PDFIcon />
            </Button>
          ) : null}
        </>
      ) : (
        <>
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
              margin="50px 10px 20px"
              href={instance.url}
              download="weatherBriex.pdf"
              isAnchor={true}
            >
              Download PDF
              <DownloadIcon />
            </Button>
          ) : null}
          <HtmlPDFViwerContainer>
            <PDFViewer width="100%" height="100%">
              {document}
            </PDFViewer>
          </HtmlPDFViwerContainer>
        </>
      )}
    </>
  );
};

export default PdfRenderer;