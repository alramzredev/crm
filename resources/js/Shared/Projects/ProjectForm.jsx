import React from 'react';
import LoadingButton from '@/Shared/LoadingButton';
import TextInput from '@/Shared/TextInput';
import SelectInput from '@/Shared/SelectInput';
import CityMunicipalityNeighborhoodSelector from '@/Shared/CityMunicipalityNeighborhoodSelector';
import { useTranslation } from 'react-i18next';

const ProjectForm = ({
  data,
  setData,
  errors,
  processing,
  onSubmit,
  submitLabel,
  owners = [],
  cities = [],
  municipalities = [],
  neighborhoods = [],
  projectTypes = [],
  projectStatuses = [],
}) => {
  const { t } = useTranslation();
  return (
    <form onSubmit={onSubmit}>
      {/* Basic Information */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">{t('basic_information')}</h3>
        <div className="flex flex-wrap -mb-8 -mr-6">
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label={t('project_code')}
            name="project_code"
            errors={errors.project_code}
            value={data.project_code}
            onChange={e => setData('project_code', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label={t('name')}
            name="name"
            errors={errors.name}
            value={data.name}
            onChange={e => setData('name', e.target.value)}
          />
          <SelectInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label={t('owner')}
            name="owner_id"
            errors={errors.owner_id}
            value={data.owner_id}
            onChange={e => setData('owner_id', e.target.value)}
          >
            <option value=""></option>
            {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </SelectInput>
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label={t('reservation_period_days')}
            name="reservation_period_days"
            type="number"
            min="1"
            max="365"
            errors={errors.reservation_period_days}
            value={data.reservation_period_days}
            onChange={e => setData('reservation_period_days', e.target.value)}
          />

          <SelectInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label={t('type')}
            name="project_type_id"
            errors={errors.project_type_id}
            value={data.project_type_id}
            onChange={e => setData('project_type_id', e.target.value)}
          >
            <option value=""></option>
            {projectTypes.map(pt => <option key={pt.id} value={pt.id}>{pt.name}</option>)}
          </SelectInput>

          <SelectInput
            className="w-full pb-8 pr-6 lg:w-1/2"
            label={t('status')}
            name="status_id"
            errors={errors.status_id}
            value={data.status_id}
            onChange={e => setData('status_id', e.target.value)}
          >
            <option value=""></option>
            {projectStatuses.map(ps => <option key={ps.id} value={ps.id}>{ps.name}</option>)}
          </SelectInput>

          <TextInput
            className="w-full pb-8 pr-6"
            label={t('location')}
            name="location"
            errors={errors.location}
            value={data.location}
            onChange={e => setData('location', e.target.value)}
          />

          <CityMunicipalityNeighborhoodSelector
            data={data}
            setData={setData}
            errors={errors}
            cities={cities}
            municipalities={municipalities}
            neighborhoods={neighborhoods}
            showCity={true}
            showMunicipality={true}
            showNeighborhood={true}
          />
        </div>
      </div>

      {/* Financial Information */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">{t('financial_information')}</h3>
        <div className="flex flex-wrap -mb-8 -mr-6">
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('budget')}
            name="budget"
            errors={errors.budget}
            value={data.budget}
            onChange={e => setData('budget', e.target.value)}
          />
          <SelectInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('warranty')}
            name="warranty"
            errors={errors.warranty}
            value={data.warranty}
            onChange={e => setData('warranty', e.target.value)}
          >
            <option value="0">{t('no')}</option>
            <option value="1">{t('yes')}</option>
          </SelectInput>
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('status_reason')}
            name="status_reason"
            errors={errors.status_reason}
            value={data.status_reason}
            onChange={e => setData('status_reason', e.target.value)}
          />
        </div>
      </div>

      {/* Project Specifications */}
      <div className="p-8 border-b">
        <h3 className="text-lg font-semibold mb-4">{t('project_specifications')}</h3>
        <div className="flex flex-wrap -mb-8 -mr-6">
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('floors')}
            name="no_of_floors"
            errors={errors.no_of_floors}
            value={data.no_of_floors}
            onChange={e => setData('no_of_floors', e.target.value)}
          />
          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('total_units')}
            name="number_of_units"
            errors={errors.number_of_units}
            value={data.number_of_units}
            onChange={e => setData('number_of_units', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('land_area')}
            name="land_area"
            type="number"
            step="0.01"
            errors={errors.land_area}
            value={data.land_area}
            onChange={e => setData('land_area', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('built_up_area')}
            name="built_up_area"
            type="number"
            step="0.01"
            errors={errors.built_up_area}
            value={data.built_up_area}
            onChange={e => setData('built_up_area', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('selling_space')}
            name="selling_space"
            type="number"
            step="0.01"
            errors={errors.selling_space}
            value={data.selling_space}
            onChange={e => setData('selling_space', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('sellable_area_factor')}
            name="sellable_area_factor"
            type="number"
            step="0.01"
            errors={errors.sellable_area_factor}
            value={data.sellable_area_factor}
            onChange={e => setData('sellable_area_factor', e.target.value)}
          />

          <TextInput
            className="w-full pb-8 pr-6 lg:w-1/3"
            label={t('floor_area_ratio')}
            name="floor_area_ratio"
            type="number"
            step="0.01"
            errors={errors.floor_area_ratio}
            value={data.floor_area_ratio}
            onChange={e => setData('floor_area_ratio', e.target.value)}
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

export default ProjectForm;
