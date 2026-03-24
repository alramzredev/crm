<?php

namespace App\Repositories;

use App\Models\Contract;

class ContractRepository
{
    /**
     * Return a base query for contracts, optionally eager loading relations.
     */
    public function query(array $with = [])
    {
        return Contract::with($with);
    }

    /**
     * Find a contract by ID.
     */
    public function find($id, array $with = [])
    {
        return Contract::with($with)->find($id);
    }

    /**
     * Get contracts for a customer.
     */
    public function getCustomerContracts($customerId, array $with = [])
    {
        return Contract::with($with)->where('customer_id', $customerId)->get();
    }

    /**
     * Get contracts for a project.
     */
    public function getProjectContracts($projectId, array $with = [])
    {
        return Contract::with($with)->where('project_id', $projectId)->get();
    }

    /**
     * Get contracts for a reservation.
     */
    public function getContractsForReservation($reservationId, array $with = [])
    {
        return Contract::with($with)->where('reservation_id', $reservationId)->get();
    }
}
