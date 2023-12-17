import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as fs from 'fs';
import path from 'path';
@Injectable()
export class ImportarService {
  async exportarExcel(sheetName: string, columnHeaders: string[], data: string[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    const headerRow = worksheet.addRow(columnHeaders);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        //   fgColor: { argb: 'FFA500' }, // Color de fondo naranja
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' }, // Color de texto blanco
      };
    });
    worksheet.columns.forEach((column) => {
      column.width = 30;
    });
    data.forEach((row) => {
      worksheet.addRow(row);
    });
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  }
  async exportarPdf(dataPdf: any, cabecera: string[], descripcion: string): Promise<ArrayBuffer> {
    const doc = new jsPDF();
    // const imageUrl = 'https://example.com/image.jpg'; // Reemplaza con la URL de tu imagen
    // const rutaActual = __dirname;
    // const rutaHaciaAtras = path.join(rutaActual, '..', '..');
    // const imagePath = path.join(
    //   rutaHaciaAtras,
    //   'public',
    //   'images',
    //   'serprovisa.jpg',
    // );
    //   try {
    //     // Lee el contenido del archivo de manera síncrona
    //     const contenido = fs.readFileSync(imagePath, 'utf-8');
    //     console.log(contenido);
    //   } catch (error) {
    //     console.error('Error al leer el archivo:', error.message);
    //   }

    // doc.addImage(imagePath, 'JPEG', 10, 10, 50, 50); // Ajusta las coordenadas y el tamaño según tus necesidades
    //await this.addImageToPdf(doc, imageUrl, 10, 10, 50, 50); // Ajusta las coordenadas y el tamaño según tus necesidades
    doc.setFont('helvetica'); // Nombre de la fuente (puedes usar "times", "courier", etc.)
    doc.setFontSize(20);
    doc.text(`Serprovisa`, 90, 20);
    doc.setFontSize(12);
    doc.text(descripcion, 10, 40);
    const fecha = new Date();
    doc.text(`Fecha: ${fecha.toLocaleString()}`, 140, 40);
    autoTable(doc, {
      head: [cabecera],
      body: dataPdf,
      startY: 50,
      didDrawCell: (data) => {},
    });
    const pdfBuffer = doc.output('arraybuffer');
    return pdfBuffer;
  }
}
