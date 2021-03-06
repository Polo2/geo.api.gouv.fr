import {useState, useCallback} from 'react'
import PropTypes from 'prop-types'

import theme from '../../../styles/theme'

import {search} from '../../../lib/api/adresse'

import {useInput} from '../../hooks/input'
import {useFetch} from '../../hooks/fetch'
import {useQuery} from '../../hooks/query'
import {useListItem} from '../../hooks/list-items'

import Section from '../../section'

import Tuto from '../../tuto'
import TryContainer from '../../try-container'
import SearchInput from '../../search-input'
import SwitchInput from '../../switch-input'

const TYPES = ['housenumber', 'street', 'locality', 'municipality']

const featuresTypes = {
  housenumber: 'numéro',
  street: 'rue',
  locality: 'lieu-dit',
  hamlet: 'hameau',
  village: 'village',
  city: 'ville',
  municipality: 'commune'
}

const renderQuery = ({input, autocomplete, type}) => {
  if (input) {
    const query = search({
      q: input,
      type,
      autocomplete: autocomplete ? 1 : 0
    })
    return query
  }

  return {url: ''}
}

const renderAdresse = (item, isHighlighted) => {
  const {id, label, context, type} = item
  return (
    <div key={id} className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
      <div>
        <div className='item-label'>{label}</div>
        <div>{context}</div>
      </div>
      <div>{featuresTypes[type]}</div>
      <style jsx>{`
        .item {
          display: flex;
          flex-flow: row;
          justify-content: space-between;
          align-items: center;
          padding: 1em;
        }

        .item .item-label {
          font-weight: 600;
        }

        .item:hover {
          cursor: pointer;
        }

        .item-highlighted {
          background-color: ${theme.primary};
          color: ${theme.colors.white};
        }
        `}</style>
    </div>
  )
}

const renderList = response => {
  return response.features.map(feature => {
    return {
      ...feature.properties
    }
  })
}

const ByAddressName = ({title, id, icon}) => {
  const [input, setInput] = useInput('20 avenue de Ségur, Paris')
  const [type, setType] = useState('housenumber')
  const [autocomplete, setAutocomplete] = useInput(true)
  const [url, options] = useQuery({input, type, autocomplete}, renderQuery)
  const [response, loading, error] = useFetch(url, options, true)
  const list = useListItem(response, renderList)

  const handleType = useCallback(_type => {
    setType(_type === type ? null : _type)
  }, [setType, type])

  return (
    <Section background='grey'>
      <div id={id}>
        <Tuto
          title={title}
          description='La variable q vous permet d’effectuer une recherche par nom.'
          icon={icon}
          exemple={url}
          results={list}
          tips='Il est possible d’utiliser la recherche par nom pour faire de l’autocomplétion.'
          side='right'
          loading={loading}
        />

        <TryContainer error={error}>
          <SearchInput
            value={input}
            items={list}
            loading={loading}
            placeholder='Chercher une adresse…'
            onSelect={item => setInput(item.label)}
            onSearch={setInput}
            renderItem={renderAdresse}
            getItemValue={item => item.label}
          />

          <SwitchInput handleChange={() => setAutocomplete(!autocomplete)} label='Autocomplétion' isChecked={autocomplete} />

          <div>
            <div key='type' className='cat'>
              <h4>Type</h4>
              <div className='fields'>
                {TYPES.map(t => (
                  <div key={t} className='field'>
                    <input
                      type='checkbox'
                      value={t}
                      checked={type === t}
                      onClick={e => handleType(e.target.value)}
                      onChange={() => { }}
                    />
                    <label className='label-inline'>{featuresTypes[t]}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TryContainer>
      </div>
      <style jsx>{`
          .cat {
            margin: 1em 0;
          }

          .fields {
            display: flex;
            flex-flow: wrap;
          }

          .field {
            display: flex;
            margin: 0 1em;
          }
          `}</style>
    </Section>
  )
}

ByAddressName.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
}

export default ByAddressName
