import { prisma } from "@/lib/prisma";
import PuzzleImage from "@/components/PuzzleImage";

export default async function TestImagesPage() {
  const levels = await prisma.level.findMany({
    where: { assetUrl: { not: null } },
    select: { id: true, number: true, title: true, assetUrl: true }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Image Test Page</h1>
      <p className="text-gray-600">This page helps debug image display issues.</p>
      
      {levels.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No levels with images found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {levels.map((level) => (
            <div key={level.id} className="border rounded p-4">
              <h2 className="text-lg font-medium mb-2">
                Level {level.number}: {level.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Image URL: {level.assetUrl}
              </p>
              <div className="border-t pt-4">
                <PuzzleImage 
                  src={level.assetUrl!}
                  alt={`Level ${level.number} puzzle`}
                  levelNumber={level.number}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium mb-2">Debug Information</h3>
        <div className="bg-gray-50 p-4 rounded text-sm">
          <p><strong>Current working directory:</strong> {process.cwd()}</p>
          <p><strong>Node environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Uploads directory:</strong> {process.cwd()}/public/uploads</p>
        </div>
      </div>
    </div>
  );
}
