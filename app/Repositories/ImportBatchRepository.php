<?php

namespace App\Repositories;

use App\Models\ImportBatch;
use App\Models\StagingProject;
use App\Models\StagingProperty;
use App\Models\StagingUnit;
use Illuminate\Support\Facades\Request;

class ImportBatchRepository
{
    public function getPaginatedBatches($filters = [])
    {
        $query = ImportBatch::with('creator');

        if (Request::get('search')) {
            $search = Request::get('search');
            $query->where(function ($q) use ($search) {
                $q->where('batch_uuid', 'like', "%{$search}%")
                  ->orWhere('file_name', 'like', "%{$search}%");
            });
        }

        if (Request::get('status') && Request::get('status') !== 'all') {
            $query->where('status', Request::get('status'));
        }

        return $query->orderByDesc('created_at')->paginate(25)->appends(Request::all());
    }

    public function getBatchInfo($batchId)
    {
        return ImportBatch::where('batch_uuid', $batchId)->first();
    }

    public function getRepositoryAndModel($importType)
    {
        $mapping = [
            'projects' => [
                'repository' => StagingProjectRepository::class,
                'model' => StagingProject::class,
            ],
            'properties' => [
                'repository' => StagingPropertyRepository::class,
                'model' => StagingProperty::class,
            ],
            'units' => [
                'repository' => StagingUnitRepository::class,
                'model' => StagingUnit::class,
            ],
        ];

        return $mapping[$importType] ?? $mapping['projects'];
    }

    public function getRepositoryInstance($importType)
    {
        $config = $this->getRepositoryAndModel($importType);
        return new $config['repository']();
    }

    public function getStagingModel($importType)
    {
        $config = $this->getRepositoryAndModel($importType);
        return $config['model'];
    }
}
