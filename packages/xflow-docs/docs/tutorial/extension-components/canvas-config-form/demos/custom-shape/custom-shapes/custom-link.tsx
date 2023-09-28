import type { NsJsonSchemaForm } from '@wow/tflow'
import React from 'react'

export const LinkShape: React.FC<NsJsonSchemaForm.IControlProps> = props => {
  const { controlSchema } = props
  return (
    <div style={{ padding: '8px 0px', marginBottom: '8px' }}>
      <a href={controlSchema.value as string} target="_blank">
        {controlSchema.label}
      </a>
    </div>
  )
}
