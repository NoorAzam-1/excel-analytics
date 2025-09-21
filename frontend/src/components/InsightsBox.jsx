const InsightsBox = ({ insight, loading }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 mt-6 text-gray-300">
        <h3 className="text-2xl font-bold mb-3">AI Insights</h3>
        <p>Generating insights...</p>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className="bg-gray-800 rounded-xl p-6 mt-6 text-gray-200">
      <h3 className="text-2xl font-bold mb-3">AI Insights</h3>
      <p>{insight}</p>
    </div>
  );
};


export default InsightsBox;
