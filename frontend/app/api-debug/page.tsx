"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOccupancyTrend, useRevenueTrend, useRevenueByHotel, useRevenueByChannel, useCancellationsByChannel } from '@/hooks/use-api';
import { apiService } from '@/lib/api-service';

export default function APIDebugPage() {
    const [testResults, setTestResults] = useState<any>({});

    // Hook calls for debugging
    const occupancyTrend = useOccupancyTrend();
    const revenueTrend = useRevenueTrend();
    const revenueByHotel = useRevenueByHotel();
    const revenueByChannel = useRevenueByChannel();
    const cancellationsByChannel = useCancellationsByChannel();

    const testDirectAPI = async () => {
        const results: any = {};

        try {
            console.log('Testing direct API calls...');

            // Test debug endpoint first
            try {
                console.log('Fetching debug info...');
                const debugResponse = await fetch('http://localhost:8000/api/debug/data-info');
                if (debugResponse.ok) {
                    const debugData = await debugResponse.json();
                    console.log('Debug data:', debugData);
                    results['debug-info'] = { success: true, data: debugData };
                }
            } catch (error) {
                results['debug-info'] = { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
            }

            // Test each chart endpoint directly
            const endpoints = [
                'http://localhost:8000/api/occupancy-trend',
                'http://localhost:8000/api/revenue-trend',
                'http://localhost:8000/api/revenue-by-hotel',
                'http://localhost:8000/api/revenue-by-channel',
                'http://localhost:8000/api/cancellations-by-channel'
            ];

            for (const endpoint of endpoints) {
                try {
                    console.log(`Fetching: ${endpoint}`);
                    const response = await fetch(endpoint);
                    console.log(`Response status: ${response.status}`);

                    if (response.ok) {
                        const data = await response.json();
                        console.log(`Data:`, data);

                        // Extract actual data array from response
                        const actualData = Array.isArray(data) ? data : data?.data || [];

                        results[endpoint] = {
                            success: true,
                            data: data,
                            actualDataType: Array.isArray(actualData) ? 'Array' : typeof actualData,
                            actualDataLength: Array.isArray(actualData) ? actualData.length : 'N/A',
                            hasDataProperty: data?.data !== undefined,
                            rawDataType: Array.isArray(data) ? 'Array' : typeof data,
                            sampleData: Array.isArray(actualData) && actualData.length > 0 ? actualData[0] : null
                        };
                    } else {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                } catch (error) {
                    console.error(`Error fetching ${endpoint}:`, error);
                    results[endpoint] = {
                        success: false,
                        error: error instanceof Error ? error.message : 'Unknown error'
                    };
                }
            }

            setTestResults(results);
        } catch (error) {
            console.error('Test failed:', error);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">API Debug Console</h1>
                <p className="text-muted-foreground">
                    Debug tool to test API connections and data loading
                </p>
            </div>

            <div className="flex gap-4 mb-4">
                <Button onClick={testDirectAPI}>
                    Test Direct API Calls
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        apiService.clearCache();
                        window.location.reload(); // Simple refresh to re-trigger hooks
                    }}
                >
                    Clear Cache & Refresh
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        // Trigger refresh on all hooks
                        occupancyTrend.refresh();
                        revenueTrend.refresh();
                        revenueByHotel.refresh();
                        revenueByChannel.refresh();
                        cancellationsByChannel.refresh();
                    }}
                >
                    Refresh All Data
                </Button>
            </div>

            {/* Hook Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Occupancy Trend Hook</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div>Loading: {occupancyTrend.loading ? 'Yes' : 'No'}</div>
                            <div>Error: {occupancyTrend.error ? occupancyTrend.error.message : 'None'}</div>
                            <div>Data: {occupancyTrend.data ? `${JSON.stringify(occupancyTrend.data).substring(0, 100)}...` : 'None'}</div>
                            <div>Data Type: {Array.isArray(occupancyTrend.data) ? 'Array' : typeof occupancyTrend.data}</div>
                            <div>Length: {Array.isArray(occupancyTrend.data) ? occupancyTrend.data.length : 'N/A'}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Trend Hook</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div>Loading: {revenueTrend.loading ? 'Yes' : 'No'}</div>
                            <div>Error: {revenueTrend.error ? revenueTrend.error.message : 'None'}</div>
                            <div>Data: {revenueTrend.data ? `${JSON.stringify(revenueTrend.data).substring(0, 100)}...` : 'None'}</div>
                            <div>Data Type: {Array.isArray(revenueTrend.data) ? 'Array' : typeof revenueTrend.data}</div>
                            <div>Length: {Array.isArray(revenueTrend.data) ? revenueTrend.data.length : 'N/A'}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Hotel Hook</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div>Loading: {revenueByHotel.loading ? 'Yes' : 'No'}</div>
                            <div>Error: {revenueByHotel.error ? revenueByHotel.error.message : 'None'}</div>
                            <div>Data: {revenueByHotel.data ? `${JSON.stringify(revenueByHotel.data).substring(0, 100)}...` : 'None'}</div>
                            <div>Data Type: {Array.isArray(revenueByHotel.data) ? 'Array' : typeof revenueByHotel.data}</div>
                            <div>Length: {Array.isArray(revenueByHotel.data) ? revenueByHotel.data.length : 'N/A'}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue by Channel Hook</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div>Loading: {revenueByChannel.loading ? 'Yes' : 'No'}</div>
                            <div>Error: {revenueByChannel.error ? revenueByChannel.error.message : 'None'}</div>
                            <div>Data: {revenueByChannel.data ? `${JSON.stringify(revenueByChannel.data).substring(0, 100)}...` : 'None'}</div>
                            <div>Data Type: {Array.isArray(revenueByChannel.data) ? 'Array' : typeof revenueByChannel.data}</div>
                            <div>Length: {Array.isArray(revenueByChannel.data) ? revenueByChannel.data.length : 'N/A'}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Cancellations by Channel Hook</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 text-sm">
                            <div>Loading: {cancellationsByChannel.loading ? 'Yes' : 'No'}</div>
                            <div>Error: {cancellationsByChannel.error ? cancellationsByChannel.error.message : 'None'}</div>
                            <div>Data: {cancellationsByChannel.data ? `${JSON.stringify(cancellationsByChannel.data).substring(0, 100)}...` : 'None'}</div>
                            <div>Data Type: {Array.isArray(cancellationsByChannel.data) ? 'Array' : typeof cancellationsByChannel.data}</div>
                            <div>Length: {Array.isArray(cancellationsByChannel.data) ? cancellationsByChannel.data.length : 'N/A'}</div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Direct API Test Results */}
            {Object.keys(testResults).length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Direct API Test Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-sm bg-muted p-4 rounded overflow-auto">
                            {JSON.stringify(testResults, null, 2)}
                        </pre>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}