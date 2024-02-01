import { useCallback } from "react";
import { Page, Text, View, Document, Image } from "@react-pdf/renderer";

import styles from "./PdfStyles";

export interface WrapedComponets {
  components: {
    type:
      | "title1"
      | "title2"
      | "title3"
      | "text"
      | "bulletpoint"
      | "report"
      | "image"
      | "contrastImage"
      | "highlightImage";
    content: string;
  }[];
  margin?: string;
  wrap?: boolean;
}

export interface Props {
  content: {
    headers?: string[];
    body: WrapedComponets[];
  };
}

const PdfDocument = ({ content }: Props) => {
  const renderFooter = useCallback(
    ({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) =>
      `Page ${pageNumber} of ${totalPages}`,
    []
  );
  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <View fixed={true} style={styles.header}>
          {content.headers?.map((row, idx) => (
            <Text key={`header-${idx}`}>{row}</Text>
          ))}
        </View>
        {content.body.map((section, idx) => (
          <View
            key={`section-${idx}`}
            style={
              section.margin ? { margin: section.margin } : styles.sectionMargin
            }
            wrap={!!section.wrap}
          >
            {section.components.map((item, subIdx) => {
              if (item.type === "title1") {
                return (
                  <Text
                    key={`component-${idx}-${subIdx}`}
                    style={styles.title1}
                  >
                    {item.content}
                  </Text>
                );
              }
              if (item.type === "title2") {
                return (
                  <Text
                    key={`component-${idx}-${subIdx}`}
                    style={styles.title2}
                  >
                    {item.content}
                  </Text>
                );
              }
              if (item.type === "title3") {
                return (
                  <Text
                    key={`component-${idx}-${subIdx}`}
                    style={styles.title3}
                  >
                    {item.content}
                  </Text>
                );
              }
              if (item.type === "text") {
                return (
                  <Text key={`component-${idx}-${subIdx}`} style={styles.text}>
                    {item.content}
                  </Text>
                );
              }
              if (item.type === "bulletpoint") {
                return (
                  <Text
                    key={`component-${idx}-${subIdx}`}
                    style={{ ...styles.text, paddingLeft: 10 }}
                  >
                    {item.content}
                  </Text>
                );
              }
              if (item.type === "report") {
                return (
                  <Text
                    key={`component-${idx}-${subIdx}`}
                    style={styles.report}
                  >
                    {item.content}
                  </Text>
                );
              }
              if (item.type === "image") {
                return (
                  <Image
                    key={`component-${idx}-${subIdx}`}
                    style={styles.image}
                    src={item.content}
                  />
                );
              }
              if (
                item.type === "contrastImage" ||
                item.type === "highlightImage"
              ) {
                return (
                  <View
                    key={`component-${idx}-${subIdx}`}
                    style={styles[item.type]}
                  >
                    <Image src={item.content} />
                  </View>
                );
              }
              return null;
            })}
          </View>
        ))}
        <Text style={styles.pageNumber} render={renderFooter} fixed={true} />
      </Page>
    </Document>
  );
};

export default PdfDocument;
