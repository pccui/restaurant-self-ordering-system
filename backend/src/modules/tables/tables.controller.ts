import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import * as QRCode from 'qrcode';

@Controller('api/admin/tables')
export class TablesController {
  @Get(':id/qr')
  async getTableQR(
    @Param('id') tableId: string,
    @Query('locale') locale: string = 'en',
    @Query('baseUrl') baseUrl: string = 'http://localhost:3000',
    @Res() res: Response,
  ) {
    const menuUrl = `${baseUrl}/${locale}/${tableId}/menu`;

    try {
      const qrDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });

      // Return JSON with QR data URL and the encoded URL
      res.json({
        tableId,
        menuUrl,
        qrCode: qrDataUrl,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate QR code' });
    }
  }

  @Get(':id/qr/image')
  async getTableQRImage(
    @Param('id') tableId: string,
    @Query('locale') locale: string = 'en',
    @Query('baseUrl') baseUrl: string = 'http://localhost:3000',
    @Res() res: Response,
  ) {
    const menuUrl = `${baseUrl}/${locale}/${tableId}/menu`;

    try {
      res.setHeader('Content-Type', 'image/png');
      await QRCode.toFileStream(res, menuUrl, {
        width: 300,
        margin: 2,
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate QR code image' });
    }
  }
}
