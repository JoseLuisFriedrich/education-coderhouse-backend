import { Request, Response } from 'express'

// main
export const infoGet = async (req: Request, res: Response) => {
  const info = {
    processId: process.pid,
    nodePath: process.execPath,
    nodeVersion: process.version,
    platform: process.platform,
    workingDirectory: process.cwd(),
    arguments: process.argv,
    memoryUsage: process.memoryUsage(),
  }

  res.status(200).send(info)
}
