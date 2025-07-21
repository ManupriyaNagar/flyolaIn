"use client";

import React, { useState } from "react";
import BASE_URL from "@/baseUrl/baseUrl";

const ApiTestPage = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});

  const testEndpoint = async (endpoint, name) => {
    setLoading(prev => ({ ...prev, [name]: true }));
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      const data = await response.json();
      setResults(prev => ({
        ...prev,
        [name]: {
          status: response.status,
          success: response.ok,
          data: data
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          status: 'Error',
          success: false,
          error: error.message
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }));
    }
  };

  const endpoints = [
    { path: '/', name: 'Root' },
    { path: '/tickets/test-data', name: 'Test Data' },
    { path: '/tickets/bookings', name: 'All Bookings' },
    { path: '/tickets/get-ticket', name: 'Get Ticket' },
    { path: '/bookings', name: 'Bookings Direct' },
    { path: '/airport', name: 'Airports' }
  ];

  return (
    <div style={{ 
      padding: "40px", 
      fontFamily: "'Inter', sans-serif",
      maxWidth: "1200px",
      margin: "0 auto"
    }}>
      <h1>API Endpoint Testing</h1>
      <p>Base URL: <strong>{BASE_URL}</strong></p>
      
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => endpoints.forEach(endpoint => testEndpoint(endpoint.path, endpoint.name))}
          style={{
            padding: "10px 20px",
            backgroundColor: "#1e40af",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          Test All Endpoints
        </button>
      </div>

      <div style={{ display: "grid", gap: "20px" }}>
        {endpoints.map(endpoint => (
          <div key={endpoint.name} style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h3>{endpoint.name}</h3>
              <button
                onClick={() => testEndpoint(endpoint.path, endpoint.name)}
                disabled={loading[endpoint.name]}
                style={{
                  padding: "5px 15px",
                  backgroundColor: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: loading[endpoint.name] ? "not-allowed" : "pointer",
                  opacity: loading[endpoint.name] ? 0.6 : 1
                }}
              >
                {loading[endpoint.name] ? "Testing..." : "Test"}
              </button>
            </div>
            
            <p><strong>URL:</strong> {BASE_URL}{endpoint.path}</p>
            
            {results[endpoint.name] && (
              <div style={{
                backgroundColor: results[endpoint.name].success ? "#f0fdf4" : "#fef2f2",
                padding: "15px",
                borderRadius: "4px",
                marginTop: "10px"
              }}>
                <p><strong>Status:</strong> {results[endpoint.name].status}</p>
                <p><strong>Success:</strong> {results[endpoint.name].success ? "✅ Yes" : "❌ No"}</p>
                
                {results[endpoint.name].error && (
                  <p><strong>Error:</strong> {results[endpoint.name].error}</p>
                )}
                
                {results[endpoint.name].data && (
                  <details style={{ marginTop: "10px" }}>
                    <summary style={{ cursor: "pointer", fontWeight: "600" }}>Response Data</summary>
                    <pre style={{
                      backgroundColor: "white",
                      padding: "10px",
                      borderRadius: "4px",
                      overflow: "auto",
                      fontSize: "12px",
                      marginTop: "10px"
                    }}>
                      {JSON.stringify(results[endpoint.name].data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: "40px", padding: "20px", backgroundColor: "#f8fafc", borderRadius: "8px" }}>
        <h2>Troubleshooting Steps:</h2>
        <ol>
          <li>Make sure your backend server is running on port 4000</li>
          <li>Check if the ticket routes are properly registered in app.js</li>
          <li>Verify the BASE_URL is correct: {BASE_URL}</li>
          <li>Check browser console for CORS errors</li>
          <li>Test the endpoints directly in your browser or Postman</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiTestPage;