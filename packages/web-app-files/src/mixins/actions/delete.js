import MixinDeleteResources from '../../mixins/deleteResources'
import { mapState } from 'vuex'
import {
  isLocationCommonActive,
  isLocationPublicActive,
  isLocationSpacesActive
} from '../../router'

export default {
  mixins: [MixinDeleteResources],
  computed: {
    ...mapState('Files', ['currentFolder']),
    $_delete_items() {
      return [
        {
          name: 'delete',
          icon: 'delete-bin-5',
          label: () => this.$gettext('Delete'),
          handler: this.$_delete_trigger,
          isEnabled: ({ resources }) => {
            if (
              !isLocationSpacesActive(this.$router, 'files-spaces-personal-home') &&
              !isLocationPublicActive(this.$router, 'files-public-files')
            ) {
              return false
            }
            if (resources.length === 0) {
              return false
            }

            const deleteDisabled = resources.some((resource) => {
              return !resource.canBeDeleted()
            })
            return !deleteDisabled
          },
          componentType: 'oc-button',
          class: 'oc-files-actions-delete-trigger'
        },
        {
          // this menu item is ONLY for the trashbin (permanently delete a file/folder)
          name: 'delete-permanent',
          icon: 'delete-bin-5',
          label: () => this.$gettext('Delete'),
          handler: this.$_delete_trigger,
          isEnabled: ({ resources }) => {
            if (!isLocationCommonActive(this.$router, 'files-common-trash')) {
              return false
            }
            return resources.length > 0
          },
          componentType: 'oc-button',
          class: 'oc-files-actions-delete-permanent-trigger'
        }
      ]
    }
  },
  methods: {
    $_delete_trigger({ resources }) {
      this.$_deleteResources_displayDialog(resources)
    }
  }
}
