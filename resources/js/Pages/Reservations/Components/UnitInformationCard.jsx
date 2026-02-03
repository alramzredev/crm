import React from 'react';

const UnitInformationCard = ({ selectedUnit }) => {
  return (
    <div className="w-full pb-8 pr-6">
      <div className="bg-indigo-50 rounded border border-indigo-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Unit Information</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Unit Code</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.unit_code}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Unit Number</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.unit_number}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Floor</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.floor || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Area (sqm)</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.area || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Rooms</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.rooms || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">Status</p>
            <p className="text-sm font-semibold text-green-600 mt-1">{selectedUnit.status?.name || '—'}</p>
          </div>
          {selectedUnit.building_surface_area && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">Building Area (sqm)</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.building_surface_area}</p>
            </div>
          )}
          {selectedUnit.wc_number && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">WC Number</p>
              <p className="text-sm font-semibold text-gray-900 mt-1">{selectedUnit.wc_number}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnitInformationCard;
