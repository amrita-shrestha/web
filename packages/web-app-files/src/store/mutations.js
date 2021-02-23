import Vue from 'vue'
import pickBy from 'lodash-es/pickBy'
import moment from 'moment'
import { attatchIndicators } from '../helpers/resources'

/**
 * @param {Array.<Object>} shares array of shares
 * @return {Array.<Integer>} array of share types
 */
function computeShareTypes(shares) {
  const shareTypes = new Set()
  shares.forEach(share => {
    shareTypes.add(share.shareType)
  })
  return Array.from(shareTypes)
}

export default {
  UPDATE_FILE_PROGRESS(state, file) {
    const fileIndex = state.inProgress.findIndex(f => {
      return f.id === file.id
    })

    if (fileIndex === -1) return

    state.inProgress[fileIndex].progress = file.progress
  },

  ADD_FILE_TO_PROGRESS(state, file) {
    state.inProgress.push({
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      progress: 0,
      action: 'upload'
    })
  },

  REMOVE_FILE_FROM_PROGRESS(state, file) {
    const fileIndex = state.inProgress.findIndex(f => {
      return f.id === file.id
    })

    state.inProgress.splice(fileIndex, 1)
    if (state.inProgress.length < 1) {
      state.inProgress = []
      state.uploaded = []
      return
    }

    file.progress = 100
    state.uploaded.push(file)
  },

  LOAD_FILES(state, { currentFolder, files }) {
    state.currentFolder = currentFolder
    state.files = files
  },
  SET_CURRENT_FOLDER(state, currentFolder) {
    state.currentFolder = currentFolder
  },
  LOAD_FILES_SEARCHED(state, files) {
    state.filesSearched = files
  },
  REMOVE_FILE_FROM_SEARCHED(state, file) {
    state.filesSearched = state.filesSearched.filter(i => file.id !== i.id)
  },
  SET_FILES_SORT(state, { field, directionIsDesc }) {
    state.fileSortDirectionDesc = directionIsDesc
    state.fileSortField = field
  },
  ADD_FILE_SELECTION(state, file) {
    const fileIndex = state.selected.findIndex(f => {
      return f.id === file.id
    })
    if (fileIndex === -1) {
      state.selected.push(file)
    }
  },
  REMOVE_FILE_SELECTION(state, file) {
    if (state.selected.length > 1) {
      state.selected = state.selected.filter(i => file.id !== i.id)
      return
    }
    state.selected = []
  },
  RESET_SELECTION(state) {
    state.selected = []
  },
  FAVORITE_FILE(state, item) {
    const fileIndex = state.files.findIndex(f => {
      return f.id === item.id
    })
    state.files[fileIndex].starred = !item.starred
  },
  ADD_FILE(state, file) {
    state.files = state.files.filter(i => file.id !== i.id)
    state.files.push(file)
  },
  REMOVE_FILE(state, removedFile) {
    state.files = state.files.filter(file => file.id !== removedFile.id)
  },
  SET_SEARCH_TERM(state, searchTerm) {
    state.searchTermGlobal = searchTerm
  },
  UPDATE_CURRENT_FILE_SHARE_TYPES(state) {
    if (!state.highlightedFile) {
      return
    }
    const fileIndex = state.files.findIndex(f => {
      return f.id === state.highlightedFile.id
    })
    state.files[fileIndex].shareTypes = computeShareTypes(state.currentFileOutgoingShares)
  },
  RENAME_FILE(state, { file, newValue, newPath }) {
    const resources = [...state.files]
    const fileIndex = resources.findIndex(f => {
      return f.id === file.id
    })

    resources[fileIndex].id = 'test'
    resources[fileIndex].name = newValue
    resources[fileIndex].path = '/' + newPath + newValue

    state.files = resources
    console.log(state.files)
  },
  DRAG_OVER(state, value) {
    state.dropzone = value
  },
  CURRENT_FILE_OUTGOING_SHARES_SET(state, shares) {
    state.currentFileOutgoingShares = shares
  },
  CURRENT_FILE_OUTGOING_SHARES_ADD(state, share) {
    state.currentFileOutgoingShares.push(share)
  },
  CURRENT_FILE_OUTGOING_SHARES_REMOVE(state, share) {
    state.currentFileOutgoingShares = state.currentFileOutgoingShares.filter(s => share.id !== s.id)
  },
  CURRENT_FILE_OUTGOING_SHARES_UPDATE(state, share) {
    const fileIndex = state.currentFileOutgoingShares.findIndex(s => {
      return s.id === share.id
    })
    if (fileIndex >= 0) {
      Vue.set(state.currentFileOutgoingShares, fileIndex, share)
    } else {
      // share was not present in the list while updating, add it instead
      state.currentFileOutgoingShares.push(share)
    }
  },
  CURRENT_FILE_OUTGOING_SHARES_ERROR(state, error) {
    state.currentFileOutgoingShares = []
    state.currentFileOutgoingSharesError = error
  },
  CURRENT_FILE_OUTGOING_SHARES_LOADING(state, loading) {
    state.currentFileOutgoingSharesLoading = loading
  },
  INCOMING_SHARES_LOAD(state, shares) {
    state.incomingShares = shares
  },
  INCOMING_SHARES_ERROR(state, error) {
    state.incomingShares = []
    state.incomingSharesError = error
  },
  INCOMING_SHARES_LOADING(state, loading) {
    state.incomingSharesLoading = loading
  },
  SHARESTREE_PRUNE_OUTSIDE_PATH(state, pathToKeep) {
    if (pathToKeep !== '' && pathToKeep !== '/') {
      // clear all children unrelated to the given path
      //
      // for example if the following paths are cached:
      // - a
      // - a/b
      // - a/b/c
      // - d/e/f
      //
      // and we request to keep only "a/b", the remaining tree becomes:
      // - a
      // - a/b
      pathToKeep += '/'
      if (pathToKeep.charAt(0) !== '/') {
        pathToKeep = '/' + pathToKeep
      }
      state.sharesTree = pickBy(state.sharesTree, (shares, path) => {
        return pathToKeep.startsWith(path + '/')
      })
    } else {
      state.sharesTree = {}
    }
  },
  SHARESTREE_ADD(state, sharesTree) {
    Object.assign(state.sharesTree, sharesTree)
  },
  SHARESTREE_ERROR(state, error) {
    state.sharesTreeError = error
  },
  SHARESTREE_LOADING(state, loading) {
    state.sharesTreeLoading = loading
  },
  UPDATE_FOLDER_LOADING(state, value) {
    state.loadingFolder = value
  },
  SET_HIGHLIGHTED_FILE(state, file) {
    if (typeof file === 'string') {
      const fileIndex = state.files.findIndex(f => {
        return f.name === file
      })
      if (fileIndex === -1) {
        return
      }
      file = state.files[fileIndex]
    }
    state.highlightedFile = file
  },
  SET_PUBLIC_LINK_PASSWORD(state, password) {
    // cache into state for reactivity
    state.publicLinkPassword = password
    if (password) {
      sessionStorage.setItem('publicLinkInfo', btoa(password))
    } else {
      sessionStorage.removeItem('publicLinkInfo')
    }
  },

  ADD_ACTION_TO_PROGRESS(state, item) {
    state.actionsInProgress.push(item)
  },

  REMOVE_ACTION_FROM_PROGRESS(state, item) {
    const itemIndex = state.actionsInProgress.findIndex(i => {
      return i === item
    })

    state.actionsInProgress.splice(itemIndex, 1)
  },

  CLEAR_CURRENT_FILES_LIST(state) {
    state.currentFolder = null
    // release blob urls
    state.files.forEach(item => {
      if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(item.previewUrl)
      }
    })
    state.files = []
  },

  SET_APP_SIDEBAR_EXPANDED_ACCORDION(state, accordion) {
    state.appSidebarExpandedAccordion = accordion
  },

  SET_APP_SIDEBAR_ACCORDION_CONTEXT(state, panel) {
    state.appSidebarAccordionContext = panel
  },

  TRIGGER_PUBLIC_LINK_EDIT(state, link) {
    // Adjust link for the edit
    link = {
      id: link.id,
      name: link.name,
      permissions: parseInt(link.permissions, 10),
      hasPassword: link.password,
      expireDate:
        link.expiration !== null
          ? moment(link.expiration)
              .endOf('day')
              .toISOString()
          : null
    }

    state.publicLinkInEdit = link
    state.appSidebarAccordionContext = 'editPublicLink'
  },

  TRIGGER_PUBLIC_LINK_CREATE(state, { name, expireDate }) {
    state.publicLinkInEdit = {
      id: null,
      name,
      permissions: 1,
      hasPassword: false,
      expireDate
    }
    state.appSidebarAccordionContext = 'editPublicLink'
  },

  LOAD_INDICATORS(state) {
    state.files.forEach(resource => attatchIndicators(resource, state.sharesTree))
  },

  PUSH_NEW_RESOURCE(state, resource) {
    state.files.push(resource)
  },

  SELECT_RESOURCES(state, resources) {
    state.selected = resources
  },

  LOAD_PREVIEWS(state, resources) {
    resources.forEach(resource => {
      const index = state.files.findIndex(r => r.id === resource.id)

      if (index > -1) {
        state.files.splice(index, 1, resource)
      }
    })
  }
}
