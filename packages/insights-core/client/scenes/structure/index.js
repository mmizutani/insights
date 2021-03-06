import './styles.scss'

// libraries
import React, { Component } from 'react'
import { connect } from 'kea/logic'

// utils
import { Layout, LayoutSplitter } from 'react-flex-layout'

// components
import Spinner from 'lib/tags/spinner'
import StructureModel from './model'

// logic
import structure from '~/scenes/structure/logic'

@connect({
  actions: [
    structure, [
      'openConnections',
      'selectModel'
    ]
  ],
  props: [
    structure, [
      'isLoading',
      'structure',
      'structureChanges',
      'connection',
      'models',
      'selectedModel',
      'numberOfChanges'
    ]
  ]
})
export default class StructureScene extends Component {
  handleOpenConnections = (e) => {
    const { openConnections } = this.props.actions

    e.preventDefault()
    openConnections()
  }

  handleSelectModel = (model) => {
    const { selectModel } = this.props.actions
    selectModel(model)
  }

  render () {
    const { isLoading, structure, connection, models, selectedModel, structureChanges, numberOfChanges } = this.props

    if (isLoading || !connection || !structure) {
      return (
        <div className='structure-scene'>
          <Spinner />
        </div>
      )
    }

    return (
      <Layout className='structure-scene' ref={ref => { this._layout = ref }}>
        <Layout layoutWidth={300}>
          <Layout layoutHeight={80}>
            <div className='models-pane'>
              <a href='/connections' onClick={this.handleOpenConnections}>&laquo; Back to all connections</a>
              <br /><br />
              <h2>{connection.keyword}</h2>
            </div>
          </Layout>
          <Layout layoutHeight='flex'>
            <div className='models-pane'>
              {models.map(model => (
                <div
                  key={model}
                  onClick={() => this.handleSelectModel(model)}
                  className={`model-row${selectedModel === model ? ' selected' : ''}${structureChanges[model] && Object.keys(structureChanges[model]).length > 0 ? ' changed' : ''}`}>
                  {model}
                  {structureChanges[model] && Object.keys(structureChanges[model]).length > 0
                    ? <span className='changed'>(changed)</span>
                    : null}
                </div>
              ))}
            </div>
          </Layout>
        </Layout>
        <LayoutSplitter />
        <Layout layoutWidth='flex' ref={ref => { this._rightPane = ref }}>
          <Layout layoutHeight={30}>
            <div className={`${numberOfChanges === 0 ? 'no-' : ''}unsaved-changes`}>
              You have {numberOfChanges === 0 ? 'no' : numberOfChanges} unsaved change{numberOfChanges === 1 ? '' : 's'}!
            </div>
          </Layout>
          <Layout layoutHeight='flex'>
            {selectedModel ? (
              <div className='models-pane'>
                <h2>{selectedModel}</h2>
                <br />
                <StructureModel key={selectedModel} />
              </div>
            ) : null}
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
