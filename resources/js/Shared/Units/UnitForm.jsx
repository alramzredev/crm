import React, { useMemo } from 'react';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import CheckboxInput from '@/Shared/CheckboxInput';

const UnitForm = ({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel,
  projects = [],
  properties = [],
  propertyTypes = [],
  propertyStatuses = [],
  unitTypes = [],
  isPropertyPredefined = false,
  predefinedProperty = null,
}) => {
  const filteredProperties = useMemo(() => {
    if (!data.project_id) return properties;
    return properties.filter(p => String(p.project_id) === String(data.project_id));
  }, [data.project_id, properties]);

  return (
    <form onSubmit={onSubmit}>
      {/* Basic Information */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
        <div className="flex flex-wrap -mb-8 -mr-6">
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Unit Code"
            name="unit_code"
            errors={errors.unit_code}
            value={data.unit_code}
            onChange={e => setData('unit_code', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Unit Number"
            name="unit_number"
            errors={errors.unit_number}
            value={data.unit_number}
            onChange={e => setData('unit_number', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="External ID"
            name="unit_external_id"
            errors={errors.unit_external_id}
            value={data.unit_external_id}
            onChange={e => setData('unit_external_id', e.target.value)}
          />

          {isPropertyPredefined && predefinedProperty ? (
            <>
              <div className="w-full pb-8 pr-6 lg:w-1/2">
                <label className="form-label">Project</label>
                <input
                  type="text"
                  value={predefinedProperty.project?.name || '—'}
                  disabled
                  className="form-input bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
              <div className="w-full pb-8 pr-6 lg:w-1/2">
                <label className="form-label">Property</label>
                <input
                  type="text"
                  value={predefinedProperty.property_code || '—'}
                  disabled
                  className="form-input bg-gray-100 text-gray-600 cursor-not-allowed"
                />
              </div>
            </>
          ) : (
            <>
              <SelectInput
                className="w-full pb-8 pr-6 lg:w-1/2"
                label="Project"
                name="project_id"
                errors={errors.project_id}
                value={data.project_id}
                onChange={e => {
                  setData('project_id', e.target.value);
                  setData('property_id', '');
                }}
              >
                <option value=""></option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </SelectInput>

              <SelectInput
                className="w-full pb-8 pr-6 lg:w-1/2"
                label="Property"
                name="property_id"
                errors={errors.property_id}
                value={data.property_id}
                onChange={e => setData('property_id', e.target.value)}
              >
                <option value=""></option>
                {filteredProperties.map(p => <option key={p.id} value={p.id}>{p.property_code}</option>)}
              </SelectInput>
            </>
          )}

          <SelectInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Property Type"
            name="property_type_id"
            errors={errors.property_type_id}
            value={data.property_type_id}
            onChange={e => setData('property_type_id', e.target.value)}
          >
            <option value=""></option>
            {propertyTypes.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
          </SelectInput>

          <SelectInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Status"
            name="status_id"
            errors={errors.status_id}
            value={data.status_id}
            onChange={e => setData('status_id', e.target.value)}
          >
            <option value=""></option>
            {propertyStatuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </SelectInput>

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Neighborhood"
            name="neighborhood"
            errors={errors.neighborhood}
            value={data.neighborhood}
            onChange={e => setData('neighborhood', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Floor"
            name="floor"
            errors={errors.floor}
            value={data.floor}
            onChange={e => setData('floor', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Area (sqm)"
            name="area"
            errors={errors.area}
            value={data.area}
            onChange={e => setData('area', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Building Surface Area"
            name="building_surface_area"
            errors={errors.building_surface_area}
            value={data.building_surface_area}
            onChange={e => setData('building_surface_area', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Housh Area"
            name="housh_area"
            errors={errors.housh_area}
            value={data.housh_area}
            onChange={e => setData('housh_area', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Rooms"
            name="rooms"
            errors={errors.rooms}
            value={data.rooms}
            onChange={e => setData('rooms', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="WC Number"
            name="wc_number"
            errors={errors.wc_number}
            value={data.wc_number}
            onChange={e => setData('wc_number', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Price"
            name="price"
            type="number"
            step="0.01"
            errors={errors.price}
            value={data.price}
            onChange={e => setData('price', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Price Base"
            name="price_base"
            type="number"
            step="0.01"
            errors={errors.price_base}
            value={data.price_base}
            onChange={e => setData('price_base', e.target.value)}
          />
        </div>
      </div>

      {/* Financial Information */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
        <div className="flex flex-wrap -mb-8 -mr-6">
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Price"
            name="price"
            type="number"
            step="0.01"
            errors={errors.price}
            value={data.price}
            onChange={e => setData('price', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Price Base"
            name="price_base"
            type="number"
            step="0.01"
            errors={errors.price_base}
            value={data.price_base}
            onChange={e => setData('price_base', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Currency"
            name="currency"
            errors={errors.currency}
            value={data.currency}
            onChange={e => setData('currency', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Exchange Rate"
            name="exchange_rate"
            type="number"
            step="0.0001"
            errors={errors.exchange_rate}
            value={data.exchange_rate}
            onChange={e => setData('exchange_rate', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Model"
            name="model"
            errors={errors.model}
            value={data.model}
            onChange={e => setData('model', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Purpose"
            name="purpose"
            errors={errors.purpose}
            value={data.purpose}
            onChange={e => setData('purpose', e.target.value)}
          />
          <SelectInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label="Unit Type"
            name="unit_type"
            errors={errors.unit_type}
            value={data.unit_type}
            onChange={e => setData('unit_type', e.target.value)}
          >
            <option value=""></option>
            {unitTypes.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </SelectInput>
        </div>
      </div>

      {/* Structural Features */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">Structural Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <CheckboxInput label="Balcony" name="has_balcony" checked={data.has_balcony} onChange={e => setData('has_balcony', e.target.checked)} errors={errors.has_balcony ? [errors.has_balcony] : []} />
          <CheckboxInput label="Basement" name="has_basement" checked={data.has_basement} onChange={e => setData('has_basement', e.target.checked)} errors={errors.has_basement ? [errors.has_basement] : []} />
          <CheckboxInput label="Basement Parking" name="has_basement_parking" checked={data.has_basement_parking} onChange={e => setData('has_basement_parking', e.target.checked)} errors={errors.has_basement_parking ? [errors.has_basement_parking] : []} />
          <CheckboxInput label="Big Housh" name="has_big_housh" checked={data.has_big_housh} onChange={e => setData('has_big_housh', e.target.checked)} errors={errors.has_big_housh ? [errors.has_big_housh] : []} />
          <CheckboxInput label="Small Housh" name="has_small_housh" checked={data.has_small_housh} onChange={e => setData('has_small_housh', e.target.checked)} errors={errors.has_small_housh ? [errors.has_small_housh] : []} />
          <CheckboxInput label="Housh" name="has_housh" checked={data.has_housh} onChange={e => setData('has_housh', e.target.checked)} errors={errors.has_housh ? [errors.has_housh] : []} />
          <CheckboxInput label="Big Roof" name="has_big_roof" checked={data.has_big_roof} onChange={e => setData('has_big_roof', e.target.checked)} errors={errors.has_big_roof ? [errors.has_big_roof] : []} />
          <CheckboxInput label="Small Roof" name="has_small_roof" checked={data.has_small_roof} onChange={e => setData('has_small_roof', e.target.checked)} errors={errors.has_small_roof ? [errors.has_small_roof] : []} />
          <CheckboxInput label="Roof" name="has_roof" checked={data.has_roof} onChange={e => setData('has_roof', e.target.checked)} errors={errors.has_roof ? [errors.has_roof] : []} />
          <CheckboxInput label="Rooftop" name="has_rooftop" checked={data.has_rooftop} onChange={e => setData('has_rooftop', e.target.checked)} errors={errors.has_rooftop ? [errors.has_rooftop] : []} />
          <CheckboxInput label="Terrace" name="has_terrace" checked={data.has_terrace} onChange={e => setData('has_terrace', e.target.checked)} errors={errors.has_terrace ? [errors.has_terrace] : []} />
          <CheckboxInput label="Outdoor" name="has_outdoor" checked={data.has_outdoor} onChange={e => setData('has_outdoor', e.target.checked)} errors={errors.has_outdoor ? [errors.has_outdoor] : []} />
        </div>
      </div>

      {/* Amenities */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <CheckboxInput label="Pool" name="has_pool" checked={data.has_pool} onChange={e => setData('has_pool', e.target.checked)} errors={errors.has_pool ? [errors.has_pool] : []} />
          <CheckboxInput label="Pool View" name="has_pool_view" checked={data.has_pool_view} onChange={e => setData('has_pool_view', e.target.checked)} errors={errors.has_pool_view ? [errors.has_pool_view] : []} />
          <CheckboxInput label="Tennis View" name="has_tennis_view" checked={data.has_tennis_view} onChange={e => setData('has_tennis_view', e.target.checked)} errors={errors.has_tennis_view ? [errors.has_tennis_view] : []} />
          <CheckboxInput label="Golf View" name="has_golf_view" checked={data.has_golf_view} onChange={e => setData('has_golf_view', e.target.checked)} errors={errors.has_golf_view ? [errors.has_golf_view] : []} />
          <CheckboxInput label="Caffe View" name="has_caffe_view" checked={data.has_caffe_view} onChange={e => setData('has_caffe_view', e.target.checked)} errors={errors.has_caffe_view ? [errors.has_caffe_view] : []} />
          <CheckboxInput label="Waterfall" name="has_waterfall" checked={data.has_waterfall} onChange={e => setData('has_waterfall', e.target.checked)} errors={errors.has_waterfall ? [errors.has_waterfall] : []} />
          <CheckboxInput label="Elevator" name="has_elevator" checked={data.has_elevator} onChange={e => setData('has_elevator', e.target.checked)} errors={errors.has_elevator ? [errors.has_elevator] : []} />
          <CheckboxInput label="Private Entrance" name="has_private_entrance" checked={data.has_private_entrance} onChange={e => setData('has_private_entrance', e.target.checked)} errors={errors.has_private_entrance ? [errors.has_private_entrance] : []} />
          <CheckboxInput label="Two Interfaces" name="has_two_interfaces" checked={data.has_two_interfaces} onChange={e => setData('has_two_interfaces', e.target.checked)} errors={errors.has_two_interfaces ? [errors.has_two_interfaces] : []} />
          <CheckboxInput label="Security System" name="has_security_system" checked={data.has_security_system} onChange={e => setData('has_security_system', e.target.checked)} errors={errors.has_security_system ? [errors.has_security_system] : []} />
          <CheckboxInput label="Internet" name="has_internet" checked={data.has_internet} onChange={e => setData('has_internet', e.target.checked)} errors={errors.has_internet ? [errors.has_internet] : []} />
        </div>
      </div>

      {/* Rooms & Spaces */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">Rooms & Spaces</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <CheckboxInput label="Kitchen" name="has_kitchen" checked={data.has_kitchen} onChange={e => setData('has_kitchen', e.target.checked)} errors={errors.has_kitchen ? [errors.has_kitchen] : []} />
          <CheckboxInput label="Laundry Room" name="has_laundry_room" checked={data.has_laundry_room} onChange={e => setData('has_laundry_room', e.target.checked)} errors={errors.has_laundry_room ? [errors.has_laundry_room] : []} />
          <CheckboxInput label="Internal Store" name="has_internal_store" checked={data.has_internal_store} onChange={e => setData('has_internal_store', e.target.checked)} errors={errors.has_internal_store ? [errors.has_internal_store] : []} />
          <CheckboxInput label="Warehouse" name="has_warehouse" checked={data.has_warehouse} onChange={e => setData('has_warehouse', e.target.checked)} errors={errors.has_warehouse ? [errors.has_warehouse] : []} />
          <CheckboxInput label="Living Room" name="has_living_room" checked={data.has_living_room} onChange={e => setData('has_living_room', e.target.checked)} errors={errors.has_living_room ? [errors.has_living_room] : []} />
          <CheckboxInput label="Family Lounge" name="has_family_lounge" checked={data.has_family_lounge} onChange={e => setData('has_family_lounge', e.target.checked)} errors={errors.has_family_lounge ? [errors.has_family_lounge] : []} />
          <CheckboxInput label="Big Lounge" name="has_big_lounge" checked={data.has_big_lounge} onChange={e => setData('has_big_lounge', e.target.checked)} errors={errors.has_big_lounge ? [errors.has_big_lounge] : []} />
          <CheckboxInput label="Food Area" name="has_food_area" checked={data.has_food_area} onChange={e => setData('has_food_area', e.target.checked)} errors={errors.has_food_area ? [errors.has_food_area] : []} />
          <CheckboxInput label="Council" name="has_council" checked={data.has_council} onChange={e => setData('has_council', e.target.checked)} errors={errors.has_council ? [errors.has_council] : []} />
          <CheckboxInput label="Diwaniyah" name="has_diwaniyah" checked={data.has_diwaniyah} onChange={e => setData('has_diwaniyah', e.target.checked)} errors={errors.has_diwaniyah ? [errors.has_diwaniyah] : []} />
          <CheckboxInput label="Diwan 1" name="has_diwan1" checked={data.has_diwan1} onChange={e => setData('has_diwan1', e.target.checked)} errors={errors.has_diwan1 ? [errors.has_diwan1] : []} />
          <CheckboxInput label="Men's Council" name="has_mens_council" checked={data.has_mens_council} onChange={e => setData('has_mens_council', e.target.checked)} errors={errors.has_mens_council ? [errors.has_mens_council] : []} />
          <CheckboxInput label="Women's Council" name="has_womens_council" checked={data.has_womens_council} onChange={e => setData('has_womens_council', e.target.checked)} errors={errors.has_womens_council ? [errors.has_womens_council] : []} />
          <CheckboxInput label="Family Council" name="has_family_council" checked={data.has_family_council} onChange={e => setData('has_family_council', e.target.checked)} errors={errors.has_family_council ? [errors.has_family_council] : []} />
          <CheckboxInput label="Maids Room" name="has_maids_room" checked={data.has_maids_room} onChange={e => setData('has_maids_room', e.target.checked)} errors={errors.has_maids_room ? [errors.has_maids_room] : []} />
          <CheckboxInput label="Drivers Room" name="has_drivers_room" checked={data.has_drivers_room} onChange={e => setData('has_drivers_room', e.target.checked)} errors={errors.has_drivers_room ? [errors.has_drivers_room] : []} />
        </div>
      </div>

      {/* Additional Information */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
        <div className="flex flex-wrap -mb-8 -mr-6">
          <TextInput
            className="w-full pb-8 pr-6"
            label="Unit Description (EN)"
            name="unit_description_en"
            errors={errors.unit_description_en}
            value={data.unit_description_en}
            onChange={e => setData('unit_description_en', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6"
            label="National Address"
            name="national_address"
            errors={errors.national_address}
            value={data.national_address}
            onChange={e => setData('national_address', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Water Meter No"
            name="water_meter_no"
            errors={errors.water_meter_no}
            value={data.water_meter_no}
            onChange={e => setData('water_meter_no', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label="Status Reason"
            name="status_reason"
            errors={errors.status_reason}
            value={data.status_reason}
            onChange={e => setData('status_reason', e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-end px-8 py-4 bg-gray-100 border-t border-gray-200">
        <LoadingButton loading={processing} type="submit" className="btn-indigo">
          {submitLabel}
        </LoadingButton>
      </div>
    </form>
  );
};

export default UnitForm;
