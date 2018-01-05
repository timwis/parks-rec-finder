import tables from '@/sources/CartoDBTables'

export default function resolveEntityType (entityType) {
  let entity = {
    name: null,
    DBTable: null
  }
  // let sanitizedType = `${entityType.charAt(0).toLowerCase()} + ${entityType.slice(1)}`.trim()
  switch (entityType) {
    case 'program':
    case 'programs':
    case 'activities':
    case 'activitiy':
      entity = {
        name: 'program',
        DBTable: tables.programs
      }
      break
    case 'programsCategory':
    case 'programCategory':
    case 'activityCategory':
    case 'activitiesCategory':
      entity = {
        name: 'programCategory',
        DBTable: tables.programCategoryTerms
      }
      break
    case 'programsCategories':
    case 'programCategories':
    case 'activitiesCategories':
    case 'activityCategories':
      entity = {
        name: 'programCategories',
        DBTable: tables.programCategories
      }
      break
    case 'programSchedules':
    case 'programSchedule':
    case 'programDays':
      entity = {
        name: 'programSchedules',
        DBTable: tables.programSchedules
      }
      break
    case 'locations':
    case 'location':
    case 'locationCategory':
    case 'facilities':
    case 'facility':
    case 'facilityCategory':
    case 'places':
    case 'placesCategory':
      entity = {
        name: 'facility',
        DBTable: tables.facilities
      }
      break
    case 'locationsCategories':
    case 'locationCategories':
    case 'facilitiesCategories':
    case 'facilityCategories':
    case 'placesCategories':
      entity = {
        name: 'facilityCategories',
        DBTable: tables.locationCategories
      }
      break
    case 'days':
    case 'weekdays':
      entity = {
        name: 'days',
        DBTable: tables.days
      }
      break
    case 'assets':
    case 'locatorpoints':
    case 'locator-points':
    case 'website_locatorpoints':
      entity = {
        name: 'assets',
        DBTable: tables.assets
      }
      break
    default:
      throw new Error(`EntityType '${entityType}' is unable to be resolved, please check src/utilities/entity-type-resolver.js for a list of all entity types`)
  }

  return entity
}
