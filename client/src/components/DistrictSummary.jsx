import React from "react";
import styled from "styled-components";

const DistrictSummaryBase = styled.div`
  display: inline-block;
  position: absolute;
  top: 150px;
  left: 0;
  margin: 10px;
  border-radius: 4px;
  background-color: #fff;
  z-index: 1 !important;
  padding: 6px;
  font-weight: bold;
  box-shadow: 0 0 0 2px rgb(0 0 0/10%);
  max-width: 350px;
  width: 350px;
  max-height: 500px;
  overflow: auto;
`

const SummaryHeader = styled.h2`
  font-size: 24px;
  margin: 0px 5px 10px 5px;
  padding: 0px;
  border-bottom: 1px solid black;
`;

const SummarySubHeader = styled.h3`
  font-size: 20px;
  margin: 10px 5px;
  padding: 0px;
  border-bottom: 1px solid #dedede;
`;

const SummaryBody = styled.div`
  font-size: 12px;
  display: flex;
  flex-direction: column;
  
`;

const SummaryLine = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SummaryLabel = styled.span`
  font-weight: bold;
  margin-right: 10px;
`;

const SummaryData = styled.span`
`;

const DistrictSummary = (props) => {
  return (
    <DistrictSummaryBase>
      <SummaryHeader>Summary data for: {props.selectedDistricts.join(", ")}</SummaryHeader>
      <SummaryBody>
        <SummaryLine>
          <SummaryLabel>Total Stations:</SummaryLabel>
          <SummaryData>{props.summary.totalStations}</SummaryData>
        </SummaryLine>
        <SummaryLine>
          <SummaryLabel>Total Docks:</SummaryLabel>
          <SummaryData>{props.summary.totalDocks}</SummaryData>
        </SummaryLine>
    { props.selectedDistricts.length > 1 && props.selectedDistricts.map(d => (
      <div>
        <SummarySubHeader>{d}</SummarySubHeader>
        <SummaryLine>
          <SummaryLabel>Total Stations:</SummaryLabel>
          <SummaryData>{props.summaries[d].totalStations}</SummaryData>
        </SummaryLine>
        <SummaryLine>
          <SummaryLabel>Total Docks:</SummaryLabel>
          <SummaryData>{props.summaries[d].totalDocks}</SummaryData>
        </SummaryLine>
      </div>
    ))
    }
      </SummaryBody>
    </DistrictSummaryBase>
  );
};

export default DistrictSummary;
