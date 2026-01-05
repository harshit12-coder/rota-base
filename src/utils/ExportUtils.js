import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { formatDate, DAYS, SHIFTS } from '../components/ROTAHelpers';

export const exportToExcel = async (employees, schedule, rotationWeeks, activeDept) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Rota Schedule');

    // Set up columns
    worksheet.columns = [
        { header: 'Week', key: 'week', width: 10 },
        { header: 'Day', key: 'day', width: 12 },
        { header: 'Date', key: 'date', width: 15 },
        { header: 'Shift A', key: 'shiftA', width: 30 },
        { header: 'Shift B', key: 'shiftB', width: 30 },
        { header: 'Shift C', key: 'shiftC', width: 30 }
    ];

    // Style the header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1F2937' }
    };

    // Add data
    for (let week = 1; week <= rotationWeeks; week++) {
        DAYS.forEach((day, dayIndex) => {
            const date = new Date();
            date.setDate(date.getDate() + (week - 1) * 7 + dayIndex);
            
            const row = {
                week: `Week ${week}`,
                day: day,
                date: formatDate(date),
                shiftA: '',
                shiftB: '',
                shiftC: ''
            };

            ['A', 'B', 'C'].forEach(shift => {
                const key = `${week}-${day}-${shift}`;
                const cell = schedule[key] || { employees: [], status: 'normal', note: '' };
                
                if (cell.employees.length > 0) {
                    row[`shift${shift}`] = cell.employees.map(emp => emp.name).join(', ');
                    if (cell.status === 'holiday') {
                        row[`shift${shift}`] = 'HOLIDAY';
                    }
                }
            });

            worksheet.addRow(row);
        });
    }

    // Add statistics section
    worksheet.addRow({});
    worksheet.addRow({ week: 'STATISTICS', day: '', date: '', shiftA: '', shiftB: '', shiftC: '' });
    
    employees.forEach(emp => {
        let totalShifts = 0;
        let nightShifts = 0;
        let weekendShifts = 0;

        Object.keys(schedule).forEach(key => {
            const [week, day, shift] = key.split('-');
            const cell = schedule[key];
            
            if (cell.employees.some(e => e.id === emp.id)) {
                totalShifts++;
                if (shift === 'C') nightShifts++;
                if (day === 'Sat' || day === 'Sun') weekendShifts++;
            }
        });

        worksheet.addRow({
            week: emp.name,
            day: `Total: ${totalShifts}`,
            date: `Nights: ${nightShifts}`,
            shiftA: `Weekends: ${weekendShifts}`,
            shiftB: '',
            shiftC: ''
        });
    });

    // Save the file
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${activeDept.name}-rota-schedule.xlsx`);
};

export const exportToPDF = () => {
    window.print();
};

export const exportToCalendar = (schedule, rotationWeeks, activeDept) => {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Rota Scheduler//Rota Schedule//EN\n';

    for (let week = 1; week <= rotationWeeks; week++) {
        DAYS.forEach((day, dayIndex) => {
            const date = new Date();
            date.setDate(date.getDate() + (week - 1) * 7 + dayIndex);
            
            ['A', 'B', 'C'].forEach(shift => {
                const key = `${week}-${day}-${shift}`;
                const cell = schedule[key] || { employees: [], status: 'normal', note: '' };
                
                if (cell.employees.length > 0 && cell.status !== 'holiday') {
                    cell.employees.forEach(emp => {
                        const startDate = new Date(date);
                        const endDate = new Date(date);
                        
                        // Set times based on shift
                        if (shift === 'A') {
                            startDate.setHours(7, 0, 0);
                            endDate.setHours(15, 30, 0);
                        } else if (shift === 'B') {
                            startDate.setHours(15, 30, 0);
                            endDate.setHours(23, 45, 0);
                        } else if (shift === 'C') {
                            startDate.setHours(23, 45, 0);
                            endDate.setDate(endDate.getDate() + 1);
                            endDate.setHours(7, 0, 0);
                        }

                        ics += `BEGIN:VEVENT\n`;
                        ics += `UID:${emp.id}-${key}@rotascheduler\n`;
                        ics += `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}\n`;
                        ics += `DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}\n`;
                        ics += `SUMMARY:${emp.name} - Shift ${shift}\n`;
                        ics += `DESCRIPTION:Shift ${shift} for ${activeDept.name}\n`;
                        ics += `END:VEVENT\n`;
                    });
                }
            });
        });
    }

    ics += 'END:VCALENDAR';

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    saveAs(blob, 'rota-schedule.ics');
};
