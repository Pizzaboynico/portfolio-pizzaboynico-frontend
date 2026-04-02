import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const assetsPath = path.join(process.cwd(), 'public', 'assets');
    
    const getFiles = (dirName: string) => {
      const dirPath = path.join(assetsPath, dirName);
      if (!fs.existsSync(dirPath)) return [];
      return fs.readdirSync(dirPath).filter(file => file.endsWith('.svg') && !file.startsWith('.'));
    };

    const data = {
      cuore: getFiles('lato-cuore'),
      destro: getFiles('lato-destro'),
      retro: getFiles('retro'),
      vinyl: getFiles('vinyl'),
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error listing assets:', error);
    return NextResponse.json({ error: 'Failed to list assets' }, { status: 500 });
  }
}
