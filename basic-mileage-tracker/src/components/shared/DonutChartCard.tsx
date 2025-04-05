// src/components/shared/DonutChartCard.tsx (Corrected X-Axis Formatter)
import React, { useState, useEffect } from 'react';
import {
    Card,
    Checkbox,
    Label,
    Dropdown,
    DropdownItem,
    Tooltip,
} from 'flowbite-react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { HiOutlineInformationCircle, HiOutlineDownload, HiOutlineDotsVertical } from 'react-icons/hi';

interface DonutChartCardProps {
    title?: string;
}

// Helper function for formatters expecting string input
const formatNumberStringWithK = (val: string | undefined | null): string => {
    if (val === null || val === undefined) return '0.0k';
    const num = parseFloat(String(val));
    if (!isNaN(num)) {
        return num.toFixed(1) + 'k';
    }
    return '0.0k';
};


const DonutChartCard: React.FC<DonutChartCardProps> = ({ title = "Website Traffic" }) => {
    // --- State ---
    const [activeDevice, setActiveDevice] = useState<'all' | 'desktop' | 'tablet' | 'mobile'>('all');
    const [chartSeries, setChartSeries] = useState<number[]>([35.1, 23.5, 2.4, 5.4]);
    const [timePeriod, setTimePeriod] = useState('Last 7 days');

    // --- Effects ---
    useEffect(() => {
        switch (activeDevice) {
            case 'desktop': setChartSeries([15.1, 22.5, 4.4, 8.4]); break;
            case 'tablet': setChartSeries([25.1, 26.5, 1.4, 3.4]); break;
            case 'mobile': setChartSeries([45.1, 27.5, 8.4, 2.4]); break;
            default: setChartSeries([35.1, 23.5, 2.4, 5.4]); break;
        }
    }, [activeDevice]);

    // --- Chart Options ---
    const chartOptions: ApexOptions = {
        colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
        chart: { height: 320, width: "100%", type: "donut", toolbar: { show: false } },
        stroke: { colors: ["transparent"], lineCap: "butt" },
        plotOptions: {
            pie: {
                donut: {
                    labels: {
                        show: true,
                        name: { show: true, fontFamily: "Inter, sans-serif", offsetY: 20 },
                        total: {
                            showAlways: true,
                            show: true,
                            label: "Unique visitors",
                            fontFamily: "Inter, sans-serif",
                            formatter: (w: any) => {
                                const seriesTotals = w?.globals?.seriesTotals;
                                if (!Array.isArray(seriesTotals)) return '0k';
                                const sum = seriesTotals.reduce((a: number, b: number) => a + b, 0);
                                return '$' + sum.toFixed(1) + 'k';
                            },
                        },
                        value: {
                            show: true,
                            fontFamily: "Inter, sans-serif",
                            offsetY: -20,
                            // Keep as string input based on previous errors
                            formatter: (val: string) => formatNumberStringWithK(val),
                        },
                    },
                    size: "80%",
                },
            },
        },
        grid: { padding: { top: -2 } },
        labels: ["Direct", "Sponsor", "Affiliate", "Email marketing"],
        dataLabels: { enabled: false },
        legend: { position: "bottom", fontFamily: "Inter, sans-serif" },
        yaxis: {
            labels: {
                 // Keep as number input based on error resolution for yaxis
                 formatter: (value: number) => {
                    return (typeof value === 'number' ? value.toFixed(1) : '0.0') + "k";
                 }
            },
        },
        xaxis: {
            labels: {
                // CORRECTED: Change back to expect string based on latest error
                formatter: (val: string) => formatNumberStringWithK(val),
            },
            axisTicks: { show: false },
            axisBorder: { show: false },
        },
    };

    // --- Handlers ---
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        const device = value as 'desktop' | 'tablet' | 'mobile';
        setActiveDevice(checked ? device : 'all');
    };

    const handleDownload = () => {
        alert('Download initiated (CSV data would be generated here)');
    };

    // --- Render Logic (No changes below this line) ---
    return (
        <Card className="max-w-sm w-full">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center">
                     <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white mr-1">{title}</h5>
                     <Tooltip
                        content={
                         <div className="max-w-xs p-1">
                           <h3 className="font-semibold">Activity growth - Incremental</h3>
                           <p className="text-xs">Report helps navigate cumulative growth...</p>
                           <h3 className="font-semibold mt-1">Calculation</h3>
                           <p className="text-xs">For each date bucket, the all-time volume...</p>
                         </div>
                       }
                       placement="bottom"
                       style="light"
                       arrow={false}
                     >
                         <HiOutlineInformationCircle className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer" />
                     </Tooltip>
                 </div>
                 <div className="flex items-center">
                      <Dropdown inline label={<HiOutlineDotsVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />} arrowIcon={false}>
                          <DropdownItem onClick={handleDownload}>
                              <HiOutlineDownload className="mr-2 h-4 w-4" />
                              Download CSV
                          </DropdownItem>
                          <DropdownItem>Another Action</DropdownItem>
                      </Dropdown>
                  </div>
            </div>

            {/* Checkboxes */}
            <div className="flex space-x-4 mb-4" id="devices">
                {(['desktop', 'tablet', 'mobile'] as const).map((device) => (
                    <div className="flex items-center" key={device}>
                        <Checkbox
                            id={device}
                            value={device}
                            checked={activeDevice === device}
                            onChange={handleCheckboxChange}
                            className="rounded-sm"
                         />
                        <Label htmlFor={device} className="ms-2 text-sm capitalize">{device}</Label>
                    </div>
                 ))}
            </div>

            {/* Donut Chart */}
            {typeof window !== 'undefined' && (
                 <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="donut"
                    height={chartOptions.chart?.height}
                    width={chartOptions.chart?.width}
                 />
             )}

             {/* Footer */}
             <div className="grid grid-cols-1 items-center border-t border-gray-200 dark:border-gray-700 justify-between mt-5 pt-5">
               <div className="flex justify-between items-center">
                 <Dropdown label={timePeriod} inline size="sm">
                   {['Yesterday', 'Today', 'Last 7 days', 'Last 30 days', 'Last 90 days'].map((period) => (
                     <DropdownItem key={period} onClick={() => setTimePeriod(period)}>
                       {period}
                     </DropdownItem>
                   ))}
                 </Dropdown>
                 <a href="#" className="uppercase text-sm font-semibold inline-flex items-center rounded-lg text-blue-600 hover:text-blue-700 dark:hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 px-3 py-2">
                   Traffic analysis
                   <svg className="w-2.5 h-2.5 ms-1.5 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
                   </svg>
                 </a>
               </div>
             </div>
        </Card>
    );
};

export default DonutChartCard;