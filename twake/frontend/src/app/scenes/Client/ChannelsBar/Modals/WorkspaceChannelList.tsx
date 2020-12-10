import React, { useState } from 'react';
import { Divider, Input, Row } from 'antd';

import Languages from 'services/languages/languages.js';
import RouterServices from 'services/RouterService';
import { Collection } from 'services/CollectionsReact/Collections';

import Icon from 'components/Icon/Icon';
import ObjectModal from 'components/ObjectModal/ObjectModal';
import { ChannelResource } from 'app/models/Channel';
import WorkspaceChannelRow from 'app/scenes/Client/ChannelsBar/Modals/WorkspaceChannelList/WorkspaceChannelRow';
import PerfectScrollbar from 'react-perfect-scrollbar';

export default () => {
  const { companyId, workspaceId } = RouterServices.useStateFromRoute();

  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(100);
  const autoChannels: { id: string; name: string; type: string; channel: ChannelResource }[] = [];
  const collectionPath = `/channels/v1/companies/${companyId}/workspaces/${workspaceId}/channels/`;
  const channelsCollection = Collection.get(collectionPath, ChannelResource);
  const channels = channelsCollection.useWatcher({}, { limit: limit });

  channels.map((channel: ChannelResource) => {
    autoChannels.push({
      id: channel.data.id || '',
      name: channel.data.name || '',
      type: 'workspace',
      channel: channel,
    });
  });

  return (
    <ObjectModal title={Languages.t('components.channelworkspacelist.title')} closable>
      <Row className="small-bottom-margin x-margin">
        <Input
          suffix={
            <Icon type="search" className="m-icon-small" style={{ color: 'var(--grey-dark)' }} />
          }
          placeholder={Languages.t('scenes.client.channelbar.workspacechannellist.autocomplete')}
          value={search}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value)}
          autoFocus
        />
      </Row>
      <PerfectScrollbar
        style={{ maxHeight: '250px' }}
        component="div"
        options={{ suppressScrollX: true, suppressScrollY: false }}
      >
        {autoChannels
          .filter(({ name }) => name.toUpperCase().indexOf(search.toUpperCase()) > -1)
          .map((channel, index) => {
            return (
              <div key={`${channel.id}_${index}`}>
                <WorkspaceChannelRow channel={channel} />
                <Divider style={{ margin: 0 }} />
              </div>
            );
          })}
        {!autoChannels.filter(({ name }) => name.toUpperCase().indexOf(search.toUpperCase()) > -1)
          .length &&
          limit < autoChannels.length + 100 &&
          setLimit(autoChannels.length + 100)}
      </PerfectScrollbar>
    </ObjectModal>
  );
};