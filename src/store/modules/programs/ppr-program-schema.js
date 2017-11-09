import { schema } from 'normalizr'
import { facilitySchema } from '@/store/modules/facilities/ppr-facility-schema'
import { activityTypeSchema } from '@/store/modules/programs/ppr-activity-type-schema'
export let programSchema = new schema.Entity('program', {
  facility: [facilitySchema],
  activity_type: [activityTypeSchema]
})
