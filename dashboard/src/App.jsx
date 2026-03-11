import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

const LEVELS = ["all", "info", "warn", "error", "debug"];

 const levelColors = {
              info: "text-blue-400",
              warn: "text-yellow-400",
              error: "text-red-400",
              debug: "text-purple-400"
            };

const DocCodeBlock = ({ code }) => {
  const lines = code.trim().split("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="relative group bg-black/70 border border-green-400/20 rounded-lg overflow-hidden">
      <button
        onClick={copy}
        className="absolute top-2 right-2 text-xs px-2 py-1 border border-green-400/30 rounded bg-black/70 hover:bg-green-400/10 opacity-0 group-hover:opacity-100 transition"
      >
        Copy
      </button>

      <pre className="text-green-300 text-xs overflow-x-auto p-3">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="select-none text-green-700 w-8 mr-3 text-right">
              {i + 1}
            </span>
            <code className="whitespace-pre">
              {line}
            </code>
          </div>
        ))}
      </pre>
    </div>
  );
};

const App = () => {
  const [logs, setLogs] = useState([]);

  const [levelFilter, setLevelFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showDocs, setShowDocs] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await axios.get("https://logflow-mtzh.onrender.com/logs");
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-green-300">
                Logger Dashboard
              </h1>
              <p className="text-sm text-green-500/70 mt-1">
                Real-time logs from your application
              </p>
            </div>

            <button
              onClick={() => setShowDocs(true)}
              className="px-4 py-2 text-xs md:text-sm border border-green-400/30 rounded-lg bg-black/40 hover:bg-green-400/10 transition"
            >
              Documentation
            </button>
          </div>
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
      {showDocs && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-black border border-green-400/20 rounded-xl p-6 overflow-y-auto max-h-[80vh]">

            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-green-300">
                Logger Platform Documentation
              </h2>

              <button
                onClick={() => setShowDocs(false)}
                className="text-sm border border-green-400/30 px-3 py-1 rounded hover:bg-green-400/10"
              >
                Close
              </button>
            </div>

            <div className="space-y-4 text-sm text-green-200 leading-relaxed">

              <div>
                <h3 className="text-green-300 font-semibold mb-1">1. Install SDK</h3>
                <DocCodeBlock code={`npm install @vik/logflux`} />
              </div>

              <div>
                <h3 className="text-green-300 font-semibold mb-1">2. Initialize Logger</h3>
                <DocCodeBlock
                  code={`import Logger from "@vik/logflux";

const logger = new Logger({
  service: "auth-service",
  apiKey: "YOUR_API_KEY",
  endpoint: "https://your-logger-api.com"
});`}
                />
              </div>

              <div>
                <h3 className="text-green-300 font-semibold mb-1">3. Send Logs</h3>
                <DocCodeBlock
                  code={`logger.info("User login", { userId: 42 });

logger.warn("Multiple login attempts", {
  ip: "192.168.1.10"
});

logger.error("Payment failed", {
  orderId: 123
});`}
                />
              </div>

              <div>
                <h3 className="text-green-300 font-semibold mb-1">4. Log Levels</h3>
                <ul className="list-disc pl-5 text-green-300/80">
                  <li>info – general information</li>
                  <li>warn – warnings</li>
                  <li>error – failures</li>
                  <li>debug – debugging information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-green-300 font-semibold mb-1">5. Features</h3>
                <ul className="list-disc pl-5 text-green-300/80">
                  <li>Batch log ingestion</li>
                  <li>Real‑time dashboard</li>
                  <li>Redis stream processing</li>
                  <li>Search and filtering</li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;