import { useQueryClient } from "@tanstack/react-query";
import { styled } from "styled-components";

import { FlightDataFromApi } from "../../../services/flightClient";
import FlightWarningList from "../../../components/FlightWarningList";
import PdfRenderer from "../../../components/common/pdfRenderer/PdfRenderer";

const HtmlLoaderContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  flightId: number;
}
const WeatherBriefingSection = ({ flightId }: Props) => {
  const queryClient = useQueryClient();

  const flightData = queryClient.getQueryData<FlightDataFromApi>([
    "flight",
    flightId,
  ]);

  if ((flightData?.weather_hours_from_etd || -1) < 0) {
    return (
      <FlightWarningList
        warnings={[
          [
            "Weather briefing data is not available for past ETD date-times. To get a weather briefing, update the ETD to a future date.",
          ],
        ]}
      />
    );
  }

  return <PdfRenderer />;
};

export default WeatherBriefingSection;
