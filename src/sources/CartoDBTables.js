const tables = {
  assets: 'ppr_website_locatorpoints',

  facilities: 'ppr_facilities',
  facilitySchedules: 'ppr_facility_schedules',
  locationCategories: 'ppr_location_types',

  programs: 'ppr_programs',
  programSchedules: 'ppr_program_schedules',
  programCategories: 'ppr_activity_categories',
  programCategoryTerms: 'ppr_activity_types',

  zipcodes: 'zip_codes',
  days: 'ppr_days' // cached in sessionStorage on router:beforeRouteEnter
}

export default tables
