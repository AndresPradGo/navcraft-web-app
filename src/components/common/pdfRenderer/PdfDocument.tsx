import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const PdfDocument = () => {
  return (
    <Document>
      <Page size="A4">
        <Text>Weather Briefing</Text>
        <Image src="https://plan.navcanada.ca/weather/images/42366552.image" />
        <Text>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam,
          error architecto. Voluptatibus maiores placeat reprehenderit quisquam
          ullam veniam optio. Numquam earum qui iste quidem eum! Rem suscipit
          non nam aspernatur repudiandae optio iure deserunt placeat iusto
          nostrum, perferendis error consequuntur? Ratione debitis laboriosam
          fugiat facilis iusto amet, modi saepe excepturi quasi architecto,
          voluptate voluptas eum ipsam sunt, dolore illo! Accusamus mollitia
          soluta voluptatum eius in eos iusto minus, consectetur corporis, ex
          consequuntur accusantium, porro earum impedit ipsum ducimus nisi totam
          eligendi dignissimos. Earum dolorum, reiciendis ipsam ratione tempore
          fugiat tenetur veniam laudantium odio quasi architecto, incidunt rem
          placeat, optio temporibus.
        </Text>
        <Text>Weather Briefing</Text>
        <Image src="https://plan.navcanada.ca/weather/images/42366552.image" />
        <Text>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam,
          error architecto. Voluptatibus maiores placeat reprehenderit quisquam
          ullam veniam optio. Numquam earum qui iste quidem eum! Rem suscipit
          non nam aspernatur repudiandae optio iure deserunt placeat iusto
          nostrum, perferendis error consequuntur? Ratione debitis laboriosam
          fugiat facilis iusto amet, modi saepe excepturi quasi architecto,
          voluptate voluptas eum ipsam sunt, dolore illo! Accusamus mollitia
          soluta voluptatum eius in eos iusto minus, consectetur corporis, ex
          consequuntur accusantium, porro earum impedit ipsum ducimus nisi totam
          eligendi dignissimos. Earum dolorum, reiciendis ipsam ratione tempore
          fugiat tenetur veniam laudantium odio quasi architecto, incidunt rem
          placeat, optio temporibus.
        </Text>
      </Page>
    </Document>
  );
};

export default PdfDocument;
