import { useParams } from "react-router-dom";
import DataAnalysis from "../pages/Analysis";

const DataAnalysisWrapper = () => {
  const { filename } = useParams();
  return <DataAnalysis filename={filename} />;
};

export default DataAnalysisWrapper;
