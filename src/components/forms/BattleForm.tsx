import { ModelSelection } from '@/components/forms/ModelSelection'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Award, Shield, Sword } from 'lucide-react'
import { z } from 'zod'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

// Form schema
const battleFormSchema = z.object({
  developerPrompt: z.string().optional(),
  userPrompt: z.string().min(1, 'User prompt is required'),
  judgeCriteria: z.string().min(1, 'Judge criteria is required'),
  selectedModels: z.array(z.string()).min(2, 'Select at least 2 models to compare'),
})

type BattleFormValues = z.infer<typeof battleFormSchema>

const defaultJudgeCriteria = `Please evaluate the responses based on the following criteria:
1. Correctness - How factually accurate is the response?
2. Completeness - How thoroughly does it address all aspects of the prompt?
3. Clarity - How clear and easy to understand is the response?
4. Creativity - Does the response show original thinking where appropriate?
5. Usefulness - How practical and helpful is the response?

Assign a score from 0-100 for each model.`

interface BattleFormProps {
  onSubmit: (values: BattleFormValues) => void
  isLoading: boolean
}

export function BattleForm({ onSubmit, isLoading }: BattleFormProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'developer' | 'judge' | 'models'>('user')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BattleFormValues>({
    resolver: zodResolver(battleFormSchema),
    defaultValues: {
      developerPrompt: '',
      userPrompt: '',
      judgeCriteria: defaultJudgeCriteria,
      selectedModels: [],
    },
  })

  const selectedModels = watch('selectedModels')

  const handleModelSelectionChange = (models: string[]) => {
    setValue('selectedModels', models, { shouldValidate: true })
  }

  const submitForm = (values: BattleFormValues) => {
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            type="button"
            className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 ${
              activeTab === 'user' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('user')}
          >
            <Sword className="w-4 h-4" />
            <span>User Prompt</span>
          </button>
          <button
            type="button"
            className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 ${
              activeTab === 'developer' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('developer')}
          >
            <Shield className="w-4 h-4" />
            <span>Developer Prompt</span>
          </button>
          <button
            type="button"
            className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 ${
              activeTab === 'judge' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('judge')}
          >
            <Award className="w-4 h-4" />
            <span>Judge Criteria</span>
          </button>
          <button
            type="button"
            className={`px-4 py-3 text-sm font-medium flex items-center space-x-2 ${
              activeTab === 'models' ? 'border-b-2 border-red-500 text-red-600' : 'text-gray-600'
            }`}
            onClick={() => setActiveTab('models')}
          >
            <span className="w-4 h-4 inline-flex items-center justify-center rounded-full bg-gray-200">
              {selectedModels.length}
            </span>
            <span>Models</span>
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* User Prompt Tab */}
          {activeTab === 'user' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">User Prompt</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This is the prompt that will be sent to all models in the battle. Be clear and specific.
                </p>
                <textarea
                  className={`w-full h-64 px-3 py-2 border rounded-md ${
                    errors.userPrompt ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter the prompt you want to evaluate the models on..."
                  {...register('userPrompt')}
                />
                {errors.userPrompt && <p className="mt-1 text-sm text-red-500">{errors.userPrompt.message}</p>}
              </div>
            </div>
          )}

          {/* Developer Prompt Tab */}
          {activeTab === 'developer' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Developer Prompt (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This is the system message / instructions that will be given to the models before the user prompt.
                </p>
                <textarea
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter any system instructions or role definition for the models..."
                  {...register('developerPrompt')}
                />
              </div>
            </div>
          )}

          {/* Judge Criteria Tab */}
          {activeTab === 'judge' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Judge Criteria</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Define how the judge should evaluate the responses. Be specific about what makes a good response.
                </p>
                <textarea
                  className={`w-full h-64 px-3 py-2 border rounded-md ${
                    errors.judgeCriteria ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter criteria for judging the model responses..."
                  {...register('judgeCriteria')}
                />
                {errors.judgeCriteria && <p className="mt-1 text-sm text-red-500">{errors.judgeCriteria.message}</p>}
              </div>
            </div>
          )}

          {/* Model Selection Tab */}
          {activeTab === 'models' && (
            <ModelSelection selectedModels={selectedModels} onChange={handleModelSelectionChange} />
          )}
        </div>
      </div>

      {/* Errors and Submit Button */}
      <div className="flex items-center justify-between">
        <div>{errors.selectedModels && <p className="text-sm text-red-500">{errors.selectedModels.message}</p>}</div>
        <Button type="submit" variant="arena" size="lg" disabled={isLoading}>
          {isLoading ? 'Preparing Battle...' : `Battle ${selectedModels.length || ''} Models`}
        </Button>
      </div>
    </form>
  )
}
