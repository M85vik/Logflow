import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const LEVELS = ["all", "info", "warn", "error", "debug"];

 const levelColors = {
              info: "text-blue-400",
              warn: "text-yellow-400",
              error: "text-red-400",
              debug: "text-purple-400"
            };
const App = () => {
  const [logs, setLogs] = useState([]);

  const [levelFilter, setLevelFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await axios.get("http://localhost:4000/logs");
      if (res) setLogs(res.data);
    };

    fetchLogs();

    const interval = setInterval(fetchLogs, 3000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (levelFilter !== "all" && log.level !== levelFilter) return false;

      if (
        serviceFilter &&
        !log.service?.toLowerCase().includes(serviceFilter.toLowerCase())
      )
        return false;

      if (
        search &&
        !log.message?.toLowerCase().includes(search.toLowerCase())
      )
        return false;

      return true;
    });
  }, [logs, levelFilter, serviceFilter, search]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-black text-green-200 font-mono p-4 md:p-10">

      <div className="max-w-6xl mx-auto">

        <div className="backdrop-blur-xl bg-white/5 border border-green-400/20 rounded-2xl p-6 mb-6 shadow-xl">
          <h1 className="text-3xl font-bold tracking-tight text-green-300">
            Logger Dashboard
          </h1>
          <p className="text-sm text-green-500/70 mt-1">
            Real-time logs from your application
          </p>
        </div>

        {/* Filters */}
        <div className="backdrop-blur-xl bg-white/5 border border-green-400/20 rounded-xl p-4 mb-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

          <input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-black/50 border border-green-400/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
          />

          <input
            placeholder="Filter service..."
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-black/50 border border-green-400/20 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-400"
          />

          <div className="flex gap-2 flex-wrap">
            {LEVELS.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-3 py-1 text-xs rounded-lg border ${
                  levelFilter === lvl
                    ? "bg-green-400/20 border-green-400"
                    : "border-green-400/20"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Logs */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">

          {filteredLogs.map((log) => (
            <div
              key={log._id}
              className="backdrop-blur-lg bg-white/5 border border-green-400/20 rounded-xl p-4 md:p-5 shadow-lg hover:bg-white/10 transition"
            >
              <div className="flex justify-between items-center text-xs">

                <div className="flex gap-3 items-center">
                  <span className={`uppercase font-semibold ${levelColors[log.level] || "text-green-300"}`}>
                    {log.level}
                  </span>

                  <span className="text-green-500/60">
                    {log.service}
                  </span>
                </div>

                <span className="text-green-500/70">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>

              </div>

              <div className="mt-2 text-sm md:text-base text-green-100">
                <span className="text-green-500/70">$</span>{" "}
                {log.message}
              </div>

              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <pre className="mt-3 text-xs bg-black/60 p-3 rounded-lg overflow-x-auto text-green-400">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              )}
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center text-green-500/60 py-10">
              No logs match the filters
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default App;