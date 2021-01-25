FROM python:2.7.9-slim
RUN apt-get update
RUN apt-get install build-essential -y
RUN apt-get install libmysqlclient-dev -y
RUN apt-get install -y python-setuptools
RUN pip install --upgrade pip
RUN pip install -U setuptools
RUN apt-get install curl -y

ARG UNAME=rareuser
ARG UID=1000
ARG GID=1000
RUN groupadd -g $GID -o $UNAME
RUN useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME
USER $UNAME

ENV USER_HOME /home/${UNAME}/
RUN mkdir ${USER_HOME}.nvm
ENV NVM_DIR ${USER_HOME}.nvm
ENV NODE_VERSION 8.12

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.9/install.sh | bash
RUN chmod +x $USER_HOME.nvm/nvm.sh
RUN . $USER_HOME/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default && npm install -g npm

USER root
RUN ln -sf $USER_HOME.nvm/versions/node/v$NODE_VERSION/bin/node /usr/bin/nodejs
RUN ln -sf $USER_HOME.nvm/versions/node/v$NODE_VERSION/bin/node /usr/bin/node
RUN ln -sf $USER_HOME.nvm/versions/node/v$NODE_VERSION/bin/npm /usr/bin/npm

